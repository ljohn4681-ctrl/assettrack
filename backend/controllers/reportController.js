const { connectDB } = require("../config/database");

const getAssetSummaryReport = async (req, res) => {
  try {
    const pool = await connectDB();

    // Overall asset summary
    const summaryResult = await pool.request().query(`
      SELECT
        COUNT(*) AS TotalAssets,
        SUM(CASE WHEN Status = 'Available' THEN 1 ELSE 0 END) AS Available,
        SUM(CASE WHEN Status = 'Assigned' THEN 1 ELSE 0 END) AS Assigned,
        SUM(CASE WHEN Status = 'Maintenance' THEN 1 ELSE 0 END) AS Maintenance,
        SUM(CASE WHEN Status = 'Retired' THEN 1 ELSE 0 END) AS Retired
      FROM dbo.Assets;
    `);

    // Asset breakdown by category
    const categoryResult = await pool.request().query(`
      SELECT
        c.Id AS CategoryId,
        c.CategoryName,
        COUNT(a.Id) AS TotalAssets,
        SUM(CASE WHEN a.Status = 'Available' THEN 1 ELSE 0 END) AS Available,
        SUM(CASE WHEN a.Status = 'Assigned' THEN 1 ELSE 0 END) AS Assigned,
        SUM(CASE WHEN a.Status = 'Maintenance' THEN 1 ELSE 0 END) AS Maintenance,
        SUM(CASE WHEN a.Status = 'Retired' THEN 1 ELSE 0 END) AS Retired
      FROM dbo.Categories c
      LEFT JOIN dbo.Assets a
        ON c.Id = a.CategoryId
      GROUP BY
        c.Id,
        c.CategoryName
      ORDER BY c.CategoryName;
    `);

    return res.status(200).json({
      success: true,
      report: {
        generatedAt: new Date().toISOString(),
        summary: summaryResult.recordset[0],
        byCategory: categoryResult.recordset,
      },
    });
  } catch (error) {
    console.error("Asset summary report error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate asset summary report.",
    });
  }
};

module.exports = {
  getAssetSummaryReport,
};