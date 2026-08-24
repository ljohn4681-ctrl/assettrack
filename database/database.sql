-- =============================================
-- AssetTrack Database
-- Office Asset and Inventory Management System
-- =============================================

-- Create the database only if it does not exist

IF DB_ID('AssetTrackDB') IS NULL
BEGIN
    CREATE DATABASE AssetTrackDB;
END
GO

-- Use the AssetTrack database

USE AssetTrackDB;
GO

-- =============================================
-- USERS TABLE
-- Stores application users for authentication
-- =============================================

IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,

        Username NVARCHAR(50) NOT NULL UNIQUE,

        PasswordHash NVARCHAR(255) NOT NULL,

        FullName NVARCHAR(100) NOT NULL,

        Role NVARCHAR(20) NOT NULL
            CONSTRAINT DF_Users_Role DEFAULT 'Admin',

        CreatedAt DATETIME2 NOT NULL
            CONSTRAINT DF_Users_CreatedAt DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- CATEGORIES TABLE
-- Stores available asset categories
-- =============================================

IF OBJECT_ID('dbo.Categories', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Categories (
        Id INT IDENTITY(1,1) PRIMARY KEY,

        CategoryName NVARCHAR(100) NOT NULL UNIQUE,

        Description NVARCHAR(255) NULL,

        CreatedAt DATETIME2 NOT NULL
            CONSTRAINT DF_Categories_CreatedAt DEFAULT GETDATE()
    );
END
GO


-- =============================================
-- ASSETS TABLE
-- Stores office assets and inventory records
-- =============================================

IF OBJECT_ID('dbo.Assets', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Assets (
        Id INT IDENTITY(1,1) PRIMARY KEY,

        AssetCode NVARCHAR(50) NOT NULL UNIQUE,

        AssetName NVARCHAR(150) NOT NULL,

        CategoryId INT NOT NULL,

        SerialNumber NVARCHAR(100) NULL,

        PurchaseDate DATE NULL,

        Status NVARCHAR(30) NOT NULL
            CONSTRAINT DF_Assets_Status DEFAULT 'Available',

        AssignedTo NVARCHAR(100) NULL,

        Remarks NVARCHAR(500) NULL,

        CreatedAt DATETIME2 NOT NULL
            CONSTRAINT DF_Assets_CreatedAt DEFAULT GETDATE(),

        UpdatedAt DATETIME2 NULL,

        CONSTRAINT FK_Assets_Categories
            FOREIGN KEY (CategoryId)
            REFERENCES dbo.Categories(Id),

        CONSTRAINT CK_Assets_Status
            CHECK (
                Status IN (
                    'Available',
                    'Assigned',
                    'Maintenance',
                    'Retired'
                )
            )
    );
END
GO

-- =============================================
-- DEFAULT CATEGORIES
-- =============================================

IF NOT EXISTS (SELECT 1 FROM dbo.Categories)
BEGIN
    INSERT INTO dbo.Categories (CategoryName, Description)
    VALUES
        ('Laptop', 'Laptop computers and portable workstations'),
        ('Monitor', 'Computer monitors and displays'),
        ('Printer', 'Printers and multifunction devices'),
        ('Mobile Device', 'Smartphones and tablets'),
        ('Network Equipment', 'Routers, switches, and network devices'),
        ('Office Equipment', 'General office equipment');
END
GO