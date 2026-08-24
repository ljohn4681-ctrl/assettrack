const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { connectDB, sql } = require("../config/database");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const pool = await connectDB();

    // Find user by username
    const result = await pool
      .request()
      .input("Username", sql.NVarChar(50), username.trim())
      .query(`
        SELECT TOP 1
          Id,
          Username,
          PasswordHash,
          FullName,
          Role
        FROM dbo.Users
        WHERE Username = @Username
      `);

    const user = result.recordset[0];

    // User does not exist
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Compare entered password with stored hash
    const passwordIsValid = await bcrypt.compare(
      password,
      user.PasswordHash
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Make sure JWT secret exists
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.Id,
        username: user.Username,
        role: user.Role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.Id,
        username: user.Username,
        fullName: user.FullName,
        role: user.Role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process login request.",
    });
  }
};

module.exports = {
  login,
};