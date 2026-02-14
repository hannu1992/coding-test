const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const productRoutes = require("./routes/products");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Routes
app.use("/products", productRoutes);

// 404 handler 
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// Error handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
