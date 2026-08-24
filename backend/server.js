const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/database");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AssetTrack API is running",
  });
});

// Retrieve categories from MSSQL
app.get("/api/categories", async (req, res) => {
  try {
    const pool = await connectDB();

    const result = await pool.request().query(`
      SELECT
        Id,
        CategoryName,
        Description,
        CreatedAt
      FROM dbo.Categories
      ORDER BY CategoryName
    `);

    res.status(200).json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Category retrieval error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve categories.",
    });
  }
});

// Start API
app.listen(PORT, async () => {
  console.log(`AssetTrack API running on http://localhost:${PORT}`);

  try {
    await connectDB();
  } catch (error) {
    console.error("API started, but database connection is unavailable.");
  }
});