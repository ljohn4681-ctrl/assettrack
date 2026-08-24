require("dotenv").config();

const bcrypt = require("bcryptjs");
const { connectDB, sql } = require("../config/database");

const createAdmin = async () => {
  try {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const fullName = process.env.ADMIN_FULL_NAME || "System Administrator";

    if (!username || !password) {
      throw new Error(
        "ADMIN_USERNAME and ADMIN_PASSWORD must be configured in .env"
      );
    }

    const pool = await connectDB();

    const existingUser = await pool
      .request()
      .input("Username", sql.NVarChar(50), username)
      .query(`
        SELECT Id
        FROM dbo.Users
        WHERE Username = @Username
      `);

    if (existingUser.recordset.length > 0) {
      console.log(`User "${username}" already exists.`);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("Username", sql.NVarChar(50), username)
      .input("PasswordHash", sql.NVarChar(255), passwordHash)
      .input("FullName", sql.NVarChar(100), fullName)
      .input("Role", sql.NVarChar(20), "Admin")
      .query(`
        INSERT INTO dbo.Users (
          Username,
          PasswordHash,
          FullName,
          Role
        )
        VALUES (
          @Username,
          @PasswordHash,
          @FullName,
          @Role
        )
      `);

    console.log(`Admin user "${username}" created successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Unable to create admin user:", error.message);
    process.exit(1);
  }
};

createAdmin();