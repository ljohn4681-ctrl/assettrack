# AssetTrack

AssetTrack is an Office Asset and Inventory Management System developed as a Junior Programmer technical assessment project.

The system allows an administrator to securely log in, manage office asset records, monitor inventory status, and generate a printable asset summary report.

---

## Features

- Secure administrator login using JWT authentication
- Protected frontend routes and REST API endpoints
- Dashboard with dynamic asset summary counts
- Create new asset records
- Retrieve and display existing asset records
- Update asset information
- Delete asset records
- Search assets
- Track asset status as Available, Assigned, Maintenance, or Retired
- Use predefined office asset categories
- Asset summary report
- Asset breakdown by category
- Manual report refresh
- Printable report
- Responsive interface using Ant Design
- Automatic frontend logout when the JWT token becomes invalid or expires

---

## Technology Stack

### Frontend

- ReactJS
- Vite
- Ant Design
- React Router
- Axios

### Backend

- Node.js
- ExpressJS
- RESTful API
- JSON Web Token (JWT)
- bcryptjs

### Database

- Microsoft SQL Server

### Development Tools

- Git
- GitHub
- Visual Studio Code
- SQL Server Management Studio
- Postman

---

## Project Structure

```text
assettrack/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── scripts/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── database/
│   └── database.sql
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── routes/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# Installation and Setup

## 1. Prerequisites

Install the following before running the project:

- Node.js
- npm
- Microsoft SQL Server
- SQL Server Management Studio
- Git

Optional but recommended:

- Visual Studio Code
- Postman

---

## 2. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/j1ohn4681-ctrl/assettrack.git
```

Then enter the project directory:

```bash
cd assettrack
```

> These commands are for a new machine or for the evaluator cloning the project. If the project already exists locally, cloning it again is not necessary.

---

## 3. Configure Microsoft SQL Server

AssetTrack uses Microsoft SQL Server.

Make sure the following are enabled:

- SQL Server service is running
- SQL Server Authentication or Mixed Mode Authentication is enabled
- TCP/IP is enabled
- SQL Server is accessible through port `1433`

---

## 4. Create the Database

Open SQL Server Management Studio.

Open the following file:

```text
database/database.sql
```

Execute the script.

The script creates:

```text
AssetTrackDB
```

It also creates the required tables and default asset categories.

Default categories include:

- Laptop
- Monitor
- Printer
- Mobile Device
- Network Equipment
- Office Equipment

---

## 5. Create a SQL Server Application Login

Create a SQL Server login that the backend can use to connect to `AssetTrackDB`.

Example:

```text
Login name: assettrack_app
Database: AssetTrackDB
```

Map the login to `AssetTrackDB` and grant the following database roles:

```text
db_datareader
db_datawriter
```

The actual password should be stored only in the backend `.env` file and should not be committed to GitHub.

---

## 6. Configure Backend Environment Variables

Go to:

```text
backend/
```

Copy:

```text
.env.example
```

Create a new file named:

```text
.env
```

Example:

```env
PORT=5000

DB_SERVER=localhost
DB_DATABASE=AssetTrackDB
DB_USER=assettrack_app
DB_PASSWORD=your_database_password
DB_PORT=1433

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=8h

ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin123!
ADMIN_FULL_NAME=System Administrator
```

Replace:

```text
your_database_password
your_secure_jwt_secret
```

with your own secure values.

The `.env` file is ignored by Git and must not be uploaded to the repository.

---

## 7. Install Backend Dependencies

Open a terminal and go to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

If Windows PowerShell blocks `npm.ps1`, use:

```powershell
npm.cmd install
```

---

## 8. Create the Administrator Account

After configuring the `.env` file, run:

```bash
npm run seed:admin
```

On Windows PowerShell:

```powershell
npm.cmd run seed:admin
```

This creates the administrator account using the values configured in `.env`.

For example, if the sample configuration is used:

```text
Username: admin
Password: Admin123!
```

The password is stored in the database as a bcrypt hash rather than plain text.

---

## 9. Start the Backend Server

From the `backend` directory:

```bash
npm run dev
```

On Windows PowerShell:

```powershell
npm.cmd run dev
```

The backend normally runs at:

```text
http://localhost:5000
```

To verify that the API is running, open:

```text
http://localhost:5000/api/health
```

A successful response should indicate that the AssetTrack API is running.

Keep this terminal open while using the application.

---

## 10. Install Frontend Dependencies

Open a second terminal.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

On Windows PowerShell:

```powershell
npm.cmd install
```

---

## 11. Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

On Windows PowerShell:

```powershell
npm.cmd run dev
```

Vite normally starts the frontend at:

```text
http://localhost:5173
```

Open this address in a web browser.

Both the backend and frontend must be running while testing the application.

---

# Testing the System

## 1. Test Login

Open:

```text
http://localhost:5173
```

Enter the administrator credentials configured in the backend `.env` file.

After successful authentication, the user is redirected to the Dashboard.

The authentication token is stored on the frontend and automatically included in protected API requests.

---

## 2. Test Protected Routes

While logged out, try opening:

```text
http://localhost:5173/assets
```

The application should redirect to the Login page.

Protected backend endpoints also reject requests without a valid JWT.

---

## 3. Test Create

Open the `Assets` page.

Click:

```text
Add Asset
```

Enter the required asset information and click:

```text
Create Asset
```

The new record should appear in the table.

This uses:

```http
POST /api/assets
```

---

## 4. Test Retrieve

Open the `Assets` page.

Asset records stored in Microsoft SQL Server should automatically appear in the table.

This uses:

```http
GET /api/assets
```

A single asset can also be retrieved through:

```http
GET /api/assets/:id
```

---

## 5. Test Update

On the Assets page:

1. Click the Edit icon beside an asset.
2. Change one or more fields.
3. Click `Save Changes`.

The updated record should appear in the table.

This uses:

```http
PUT /api/assets/:id
```

---

## 6. Test Delete

On the Assets page:

1. Click the Delete icon beside an asset.
2. Confirm the deletion.

The asset should be removed from the table and from Microsoft SQL Server.

This uses:

```http
DELETE /api/assets/:id
```

---

## 7. Test Search

Use the search field on the Assets page.

Search can match information such as:

- Asset code
- Asset name
- Category
- Serial number
- Status
- Assigned employee or department

---

## 8. Test Dashboard

Open the Dashboard.

The dashboard displays summary values for:

- Total Assets
- Available
- Assigned
- Maintenance
- Retired

The values are retrieved from the backend report API and are based on records stored in Microsoft SQL Server.

---

## 9. Test Report

Open the `Reports` page.

The report displays:

- Total Assets
- Available Assets
- Assigned Assets
- Assets Under Maintenance
- Retired Assets
- Asset Breakdown by Category

Click:

```text
Refresh
```

to retrieve the latest report information.

---

## 10. Test Print Report

From the Reports page, click:

```text
Print Report
```

The browser print preview should open.

The print layout is optimized so that navigation controls are hidden and the complete report table fits the printed page.

For a cleaner printout, browser-generated headers and footers may be disabled from the browser's print settings.

---

## 11. Test Logout

Click the administrator profile in the upper-right portion of the application.

Select:

```text
Logout
```

The authentication information should be removed and the user should return to the Login page.

If the JWT becomes invalid or expires, the frontend also automatically clears the session and redirects the user to Login.

---

# REST API Endpoints

## Authentication

### Login

```http
POST /api/auth/login
```

Example request body:

```json
{
  "username": "admin",
  "password": "Admin123!"
}
```

---

## Assets

### Retrieve All Assets

```http
GET /api/assets
```

### Retrieve Single Asset

```http
GET /api/assets/:id
```

### Create Asset

```http
POST /api/assets
```

### Update Asset

```http
PUT /api/assets/:id
```

### Delete Asset

```http
DELETE /api/assets/:id
```

Asset endpoints require a valid JWT.

Example header:

```text
Authorization: Bearer <token>
```

---

## Reports

### Asset Summary Report

```http
GET /api/reports/assets-summary
```

The report endpoint returns overall asset status totals and asset totals grouped by category.

---

## Health Check

```http
GET /api/health
```

This endpoint can be used to verify that the backend is running.

---

# Asset Status Definitions

## Available

The asset is available for assignment or use.

## Assigned

The asset is currently assigned to an employee or department.

## Maintenance

The asset is temporarily unavailable because it is undergoing maintenance or repair.

## Retired

The asset has been permanently removed from active service and may be scheduled for disposal, replacement, donation, or write-off.

---

# Security

AssetTrack implements the following basic security practices:

- User passwords are stored as bcrypt hashes.
- Authentication is handled using JSON Web Tokens.
- Protected API endpoints require a valid JWT.
- Expired or invalid tokens automatically end the frontend session.
- SQL queries use parameterized inputs.
- Database credentials and JWT secrets are stored through environment variables.
- `.env` is excluded from Git through `.gitignore`.

---

# Challenges Encountered

## SQL Server Connectivity

The backend initially required additional Microsoft SQL Server configuration before Node.js could connect successfully.

TCP/IP was enabled, SQL Server authentication was configured, and port `1433` was used for the application connection.

This reinforced the importance of checking both application configuration and database server network configuration when diagnosing database connectivity problems.

## JWT Authentication

JWT authentication was implemented to protect API endpoints.

During final testing, an expired token remained in browser local storage. The frontend initially continued displaying the protected interface even though the backend correctly rejected the token.

An Axios response interceptor was added so that a `401 Unauthorized` response automatically removes the invalid session and redirects the user to Login.

## React Hooks and ESLint

A React Hooks warning occurred while asynchronous data-loading functions were being called from `useEffect`.

The initial loading logic was restructured so API calls were handled safely inside the effect while avoiding unnecessary hook dependency warnings.

## Loading Assets and Categories

The Assets interface requires both asset information and category data.

`Promise.all()` was used during initial loading so both requests could be executed concurrently before rendering the required information.

## Printable Report Layout

The original report table used horizontal scrolling on screen.

This caused one of the table columns to be partially hidden in browser print preview.

The table and print-specific CSS were adjusted so the complete report fits properly on the printed page without a horizontal scrollbar.

## Git Workflow

Git was used throughout development rather than committing the entire project only at the end.

Features such as database setup, authentication, CRUD operations, reporting, frontend functionality, and styling were committed separately to maintain a clearer project development history.

---

# Development Workflow

The project was developed through feature-based Git commits covering:

```text
Project initialization
Database schema
Express REST API
Microsoft SQL Server connection
User authentication
Create asset functionality
Retrieve asset functionality
Update asset functionality
Delete asset functionality
Asset summary report
React frontend
Protected dashboard and routing
Asset management interface
Report interface
Frontend UI styling
Documentation
```

---

# Notes

- The backend and frontend must both be running for the complete application to work.
- Microsoft SQL Server must be running before starting the backend.
- Never commit the `.env` file.
- Replace sample passwords and secrets before using the project outside a development or assessment environment.

---

# Author

Developed as a Junior Programmer Technical Assessment Project.