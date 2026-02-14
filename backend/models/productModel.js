const knex = require("../db/knex");
const slugify = require("../utils/slugify");

/**
 * Find product by slug
 * @param {string} slug
 * @param {number|string|null} excludeId - Exclude ID (for updates)
 * @returns {Promise<Object|null>}
 */
async function findBySlug(slug, excludeId = null) {
  let query = knex("products").where({ slug });

  if (excludeId) {
    query = query.andWhereNot({ id: excludeId });
  }

  return query.first();
}

/**
 * Get all products with optional filtering and sorting
 * @param {Object} params
 * @param {string} [params.name]
 * @param {string} [params.sort]
 * @param {string} [params.order]
 * @returns {Promise<Array>}
 */
async function getProducts(params = {}) {
  const { name, sort, order } = params;

  let query = knex("products");

  // Filter by name
  if (name) {
    query = query.where("name", "like", `%${name}%`);
  }

  // Sorting
  if (sort) {
    const sortOrder = order === "desc" ? "desc" : "asc";
    query = query.orderBy(sort, sortOrder);
  }

  return query;
}

/**
 * Get product by ID
 * @param {number|string} id
 * @returns {Promise<Object|null>}
 */
async function getProductById(id) {
  return knex("products").where({ id }).first();
}

/**
 * Create a new product
 * Slug must be unique
 * @param {Object} data
 * @param {string} data.name
 * @param {number} data.quantity
 * @returns {Promise<Object>}
 */
async function createProduct({ name, quantity }) {
  const slug = slugify(name);

  const existing = await findBySlug(slug);
  if (existing) {
    const err = new Error("Product with this name already exists");
    err.statusCode = 409;
    throw err;
  }

  const [id] = await knex("products").insert({
    name,
    slug,
    quantity
  });

  return getProductById(id);
}

/**
 * Update an existing product
 * If name changes, slug is regenerated and must remain unique
 * @param {number|string} id
 * @param {Object} data
 * @param {string} [data.name]
 * @param {number} [data.quantity]
 * @returns {Promise<Object|null>}
 */
async function updateProduct(id, { name, quantity }) {
  const existing = await getProductById(id);
  if (!existing) return null;

  let slug = existing.slug;

  // If name changed → regenerate slug and check uniqueness
  if (name && name !== existing.name) {
    slug = slugify(name);

    const duplicate = await findBySlug(slug, id);
    if (duplicate) {
      const err = new Error("Product with this name already exists");
      err.statusCode = 409;
      throw err;
    }
  }

  await knex("products")
    .where({ id })
    .update({
      name: name ?? existing.name,
      quantity: quantity ?? existing.quantity,
      slug
    });

  return getProductById(id);
}

/**
 * Delete a product by ID
 * @param {number|string} id
 * @returns {Promise<boolean>}
 */
async function deleteProduct(id) {
  const count = await knex("products").where({ id }).del();
  return count > 0;
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  findBySlug
};
