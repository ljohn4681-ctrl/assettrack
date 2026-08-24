const express = require("express");

const { createAsset } = require("../controllers/assetController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createAsset);

module.exports = router;