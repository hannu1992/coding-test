const express = require("express");
const router = express.Router();
const ProductService = require("../services/productService");
const { success } = require("../utils/response");

/**
 * GET /products
 * Get all products with optional filtering and sorting
 */
router.get("/", async (req, res, next) => {
  try {
    const products = await ProductService.getProducts(req.query);
    return success(res, "Product list fetched successfully", products);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /products/:id
 * Get a single product by ID
 */
router.get("/:id", async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    return success(res, "Product detail fetched successfully", product);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /products
 * Create a new product
 */
router.post("/", async (req, res, next) => {
  try {
    const product = await ProductService.createProduct(req.body);
    return success(res, "Product created successfully", product, 201);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /products/:id
 * Update an existing product
 */
router.put("/:id", async (req, res, next) => {
  try {
    const product = await ProductService.updateProduct(
      req.params.id,
      req.body
    );
    return success(res, "Product updated successfully", product);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /products/:id
 * Delete a product by ID
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    return success(res, "Product deleted successfully");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
