const express = require("express");

const {
  createAsset,
  getAssets,
  getAssetById,
} = require("../controllers/assetController");

const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getAssets);

router.get("/:id", authenticateToken, getAssetById);

router.post("/", authenticateToken, createAsset);

module.exports = router;