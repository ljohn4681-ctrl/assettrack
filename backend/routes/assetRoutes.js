const express = require("express");

const {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} = require("../controllers/assetController");

const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getAssets);

router.get("/:id", authenticateToken, getAssetById);

router.post("/", authenticateToken, createAsset);

router.put("/:id", authenticateToken, updateAsset);

router.delete("/:id", authenticateToken, deleteAsset);

module.exports = router;

