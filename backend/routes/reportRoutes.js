const express = require("express");

const {
  getAssetSummaryReport,
} = require("../controllers/reportController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/assets-summary",
  authenticateToken,
  getAssetSummaryReport
);

module.exports = router;