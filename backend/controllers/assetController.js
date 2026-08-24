const { connectDB, sql } = require("../config/database");

const createAsset = async (req, res) => {
  try {
    const {
      assetCode,
      assetName,
      categoryId,
      serialNumber,
      purchaseDate,
      status,
      assignedTo,
      remarks,
    } = req.body || {};

    if (!assetCode || !assetName || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Asset code, asset name, and category are required.",
      });
    }

    const validStatuses = [
      "Available",
      "Assigned",
      "Maintenance",
      "Retired",
    ];

    const assetStatus = status || "Available";

    if (!validStatuses.includes(assetStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid asset status.",
      });
    }

    const pool = await connectDB();

    // Check if category exists
    const categoryResult = await pool
      .request()
      .input("CategoryId", sql.Int, categoryId)
      .query(`
        SELECT Id
        FROM dbo.Categories
        WHERE Id = @CategoryId
      `);

    if (categoryResult.recordset.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Selected category does not exist.",
      });
    }

    // Prevent duplicate asset codes
    const duplicateResult = await pool
      .request()
      .input("AssetCode", sql.NVarChar(50), assetCode.trim())
      .query(`
        SELECT Id
        FROM dbo.Assets
        WHERE AssetCode = @AssetCode
      `);

    if (duplicateResult.recordset.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Asset code already exists.",
      });
    }

    const result = await pool
      .request()
      .input("AssetCode", sql.NVarChar(50), assetCode.trim())
      .input("AssetName", sql.NVarChar(150), assetName.trim())
      .input("CategoryId", sql.Int, categoryId)
      .input("SerialNumber", sql.NVarChar(100), serialNumber || null)
      .input("PurchaseDate", sql.Date, purchaseDate || null)
      .input("Status", sql.NVarChar(30), assetStatus)
      .input("AssignedTo", sql.NVarChar(100), assignedTo || null)
      .input("Remarks", sql.NVarChar(500), remarks || null)
      .query(`
        INSERT INTO dbo.Assets (
          AssetCode,
          AssetName,
          CategoryId,
          SerialNumber,
          PurchaseDate,
          Status,
          AssignedTo,
          Remarks
        )
        OUTPUT
          INSERTED.Id,
          INSERTED.AssetCode,
          INSERTED.AssetName,
          INSERTED.CategoryId,
          INSERTED.SerialNumber,
          INSERTED.PurchaseDate,
          INSERTED.Status,
          INSERTED.AssignedTo,
          INSERTED.Remarks,
          INSERTED.CreatedAt
        VALUES (
          @AssetCode,
          @AssetName,
          @CategoryId,
          @SerialNumber,
          @PurchaseDate,
          @Status,
          @AssignedTo,
          @Remarks
        )
      `);

    return res.status(201).json({
      success: true,
      message: "Asset created successfully.",
      data: result.recordset[0],
    });
  } catch (error) {
    console.error("Create asset error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create asset.",
    });
  }
};

module.exports = {
  createAsset,
};