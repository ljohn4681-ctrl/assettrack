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

const getAssets = async (req, res) => {
  try {
    const pool = await connectDB();

    const result = await pool.request().query(`
      SELECT
        a.Id,
        a.AssetCode,
        a.AssetName,
        a.CategoryId,
        c.CategoryName,
        a.SerialNumber,
        a.PurchaseDate,
        a.Status,
        a.AssignedTo,
        a.Remarks,
        a.CreatedAt,
        a.UpdatedAt
      FROM dbo.Assets a
      INNER JOIN dbo.Categories c
        ON a.CategoryId = c.Id
      ORDER BY a.Id DESC
    `);

    return res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Retrieve assets error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve assets.",
    });
  }
};


const getAssetById = async (req, res) => {
  try {
    const assetId = parseInt(req.params.id, 10);

    if (Number.isNaN(assetId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid asset ID.",
      });
    }

    const pool = await connectDB();

    const result = await pool
      .request()
      .input("Id", sql.Int, assetId)
      .query(`
        SELECT
          a.Id,
          a.AssetCode,
          a.AssetName,
          a.CategoryId,
          c.CategoryName,
          a.SerialNumber,
          a.PurchaseDate,
          a.Status,
          a.AssignedTo,
          a.Remarks,
          a.CreatedAt,
          a.UpdatedAt
        FROM dbo.Assets a
        INNER JOIN dbo.Categories c
          ON a.CategoryId = c.Id
        WHERE a.Id = @Id
      `);

    const asset = result.recordset[0];

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    console.error("Retrieve asset error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve asset.",
    });
  }
};

const updateAsset = async (req, res) => {
  try {
    const assetId = parseInt(req.params.id, 10);

    if (Number.isNaN(assetId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid asset ID.",
      });
    }

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

    // Check if asset exists
    const existingAsset = await pool
      .request()
      .input("Id", sql.Int, assetId)
      .query(`
        SELECT Id
        FROM dbo.Assets
        WHERE Id = @Id
      `);

    if (existingAsset.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Asset not found.",
      });
    }

    // Check if selected category exists
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

    // Prevent duplicate asset code
    // Exclude the asset currently being updated
    const duplicateResult = await pool
      .request()
      .input("AssetCode", sql.NVarChar(50), assetCode.trim())
      .input("Id", sql.Int, assetId)
      .query(`
        SELECT Id
        FROM dbo.Assets
        WHERE AssetCode = @AssetCode
          AND Id <> @Id
      `);

    if (duplicateResult.recordset.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Asset code already exists.",
      });
    }

    const result = await pool
      .request()
      .input("Id", sql.Int, assetId)
      .input("AssetCode", sql.NVarChar(50), assetCode.trim())
      .input("AssetName", sql.NVarChar(150), assetName.trim())
      .input("CategoryId", sql.Int, categoryId)
      .input("SerialNumber", sql.NVarChar(100), serialNumber || null)
      .input("PurchaseDate", sql.Date, purchaseDate || null)
      .input("Status", sql.NVarChar(30), assetStatus)
      .input("AssignedTo", sql.NVarChar(100), assignedTo || null)
      .input("Remarks", sql.NVarChar(500), remarks || null)
      .query(`
        UPDATE dbo.Assets
        SET
          AssetCode = @AssetCode,
          AssetName = @AssetName,
          CategoryId = @CategoryId,
          SerialNumber = @SerialNumber,
          PurchaseDate = @PurchaseDate,
          Status = @Status,
          AssignedTo = @AssignedTo,
          Remarks = @Remarks,
          UpdatedAt = GETDATE()
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
          INSERTED.CreatedAt,
          INSERTED.UpdatedAt
        WHERE Id = @Id
      `);

    return res.status(200).json({
      success: true,
      message: "Asset updated successfully.",
      data: result.recordset[0],
    });
  } catch (error) {
    console.error("Update asset error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update asset.",
    });
  }
};

module.exports = {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
};