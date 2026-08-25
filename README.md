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

This project was also a learning experience for me. As a fresh graduate, some of the applications and technologies used in this assessment were new to me. I already had a basic background and understanding of how some of them work, but this was my first time using several of these technologies together in one complete application.

I wanted to be transparent about my development process because this assessment was not only about completing the system for me, but also about learning how the different technologies work together.

## Learning a Different Database Environment

Microsoft SQL Server was not the database environment I was most familiar with before this project.

I already understood the basic purpose of a database, such as creating tables, storing records, retrieving data, updating information, and working with relationships. The main difference for me was learning the structure, configuration, connection setup, and tools used by Microsoft SQL Server.

One of the challenges I encountered was connecting the ExpressJS backend to SQL Server. I had to understand SQL Server authentication, TCP/IP configuration, port `1433`, database users, permissions, and how the backend application communicates with the database.

Once I understood the setup, the database functions became easier to work with because the main database concepts were already familiar to me.

## Connecting the Frontend, API, and Database

Another challenge was understanding how all parts of the application communicate with each other.

The project follows this flow:

```text
ReactJS + Ant Design
        ↓
      Axios
        ↓
ExpressJS REST API
        ↓
Microsoft SQL Server
```

I already knew what I wanted the system to do, but some of the actual connection code, syntax, configuration, and setup were new to me.

I used AI as a learning and development guide, especially when working with unfamiliar setup, code connections, syntax, and troubleshooting errors. Some of the technical connection code was developed with AI guidance.

However, the functions of the system, the workflow, the logic of what should happen, the information that should appear on the Dashboard, and the overall UI and user experience were based on how I wanted the system to work.

For example, I decided what the administrator should see, what information should be available on the Dashboard, how asset records should be created and managed, what statuses should be used, and what information should appear in the report.

For me, the important part was not only making the code work, but also understanding why each part was needed and testing how it connects with the rest of the application.

## Authentication and Expired Tokens

JWT authentication was another part that I had to understand more while developing the project.

The login functionality was able to generate a token and protect the API endpoints. However, during final testing, I encountered an issue where an expired token remained stored in the browser.

The backend correctly rejected the expired token, but the frontend was still displaying the protected Dashboard.

I fixed this by adding handling for `401 Unauthorized` responses in Axios. When the authentication token becomes invalid or expires, the application now removes the stored login information and redirects the user back to the Login page.

This helped me understand more clearly how frontend and backend authentication work together.

## React Hooks and Data Loading

While building the Assets page, I encountered a React Hooks and ESLint warning related to asynchronous functions being called inside `useEffect`.

At first, I did not fully understand why it was being flagged because the application could still run.

After reviewing the issue, I learned more about how React handles effects and dependencies. I restructured the initial data-loading process and used `Promise.all()` to retrieve the asset records and category information together.

This also made the loading process cleaner and helped me understand React Hooks better.

## Asset CRUD Operations

Implementing the CRUD functions also helped me understand more about how the frontend, REST API, and database work together.

The application uses the following operations:

```text
CREATE
POST /api/assets

RETRIEVE
GET /api/assets

UPDATE
PUT /api/assets/:id

DELETE
DELETE /api/assets/:id
```

I tested each function separately before connecting them to the frontend interface.

This helped me understand that when an administrator performs an action in the React interface, the request goes through the REST API before the data is stored or changed in Microsoft SQL Server.

## Report Generation and Printing

The report functionality worked correctly on screen, but I encountered another issue during print testing.

The original report table had horizontal scrolling, which caused one of the columns to be partially hidden in the browser print preview.

I adjusted the table layout and print-specific CSS so the complete report could fit properly on the printed page without a horizontal scrollbar.

This taught me that even if a feature works correctly on the screen, it is still important to test how it behaves in other outputs such as printing.

## Git and GitHub

I also became more familiar with using Git and GitHub during this project.

Instead of uploading the whole project only after everything was finished, I committed different stages of development separately.

Some of the commits include:

```text
User authentication
Create asset functionality
Retrieve asset functionality
Update asset functionality
Delete asset functionality
Asset summary report
Frontend dashboard
Asset management interface
Report interface
UI styling
Documentation
```

This helped me understand how Git can be used to track development progress and make changes easier to review.

## Overall Learning Experience

Overall, this assessment introduced me to several applications, tools, and configurations that I had not used extensively before.

I want to be transparent that AI was an important learning tool for me during the development of this project. It helped guide me through unfamiliar technologies, configuration, code connections, debugging, and understanding errors.

At the same time, I did not simply ask AI to decide what the system should be.

I was the one who decided the purpose of the system, the functions it should have, the workflow, the information that should be displayed, the asset management process, the Dashboard contents, the report requirements, and the overall UI and user experience.

The Dashboard and main administrator interface were designed around what I believed an asset administrator would need to see and manage.

As a fresh graduate, I know that there are still many technologies and development practices that I need to learn. I may not immediately know how every unfamiliar application works, but I am willing to research, ask questions, test solutions, understand the logic behind them, and learn how to use them properly.

This project showed me that even when I encounter unfamiliar tools, I can adapt, learn quickly, troubleshoot problems, and turn an idea into a working application.

I am eager to continue learning and improve my skills through actual development experience.

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