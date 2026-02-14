const ProductModel = require("../models/productModel");

/**
 * Create a new product after validating input
 * @param {Object} data - Product data
 * @param {string} data.name - Product name
 * @param {number} data.quantity - Product quantity
 * @returns {Promise<Object>} Created product
 */
async function createProduct(data) {
  const { name, quantity } = data;

  // Name validation
  if (!name || typeof name !== "string" || !name.trim()) {
    const err = new Error("Product name is required");
    err.statusCode = 400;
    throw err;
  }

  // Quantity validation
  if (quantity == null || isNaN(quantity) || quantity < 0) {
    const err = new Error("Valid quantity is required");
    err.statusCode = 400;
    throw err;
  }

  // Model handles slug + uniqueness
  return ProductModel.createProduct({
    name: name.trim(),
    quantity: Number(quantity)
  });
}

/**
 * Update an existing product
 * @param {number|string} id - Product ID
 * @param {Object} data - Fields to update
 * @param {string} [data.name]
 * @param {number} [data.quantity]
 * @returns {Promise<Object>} Updated product
 */
async function updateProduct(id, data) {
  // ID validation
  if (!id || isNaN(id)) {
    const err = new Error("Invalid product ID");
    err.statusCode = 400;
    throw err;
  }

  const updateData = {};

  // Validate name if provided
  if (data.name !== undefined) {
    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
      const err = new Error("Product name is required");
      err.statusCode = 400;
      throw err;
    }
    updateData.name = data.name.trim();
  }

  // Validate quantity if provided
  if (data.quantity !== undefined) {
    if (isNaN(data.quantity) || data.quantity < 0) {
      const err = new Error("Valid quantity is required");
      err.statusCode = 400;
      throw err;
    }
    updateData.quantity = Number(data.quantity);
  }

  const product = await ProductModel.updateProduct(id, updateData);

  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  return product;
}

/**
 * Delete a product by ID
 * @param {number|string} id
 * @returns {Promise<boolean>}
 */
async function deleteProduct(id) {
  if (!id || isNaN(id)) {
    const err = new Error("Invalid product ID");
    err.statusCode = 400;
    throw err;
  }

  const deleted = await ProductModel.deleteProduct(id);

  if (!deleted) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  return true;
}

/**
 * Get products with optional filtering and sorting
 * @param {Object} query
 * @returns {Promise<Array>}
 */
async function getProducts(query) {
  return ProductModel.getProducts(query);
}

/**
 * Get a product by ID
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
async function getProductById(id) {
  if (!id || isNaN(id)) {
    const err = new Error("Invalid product ID");
    err.statusCode = 400;
    throw err;
  }

  const product = await ProductModel.getProductById(id);

  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  return product;
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById
};
