# Rapid Fitness Management System

**Developers:** Ceina Ellison & Eman Alturky
**Date:** June 2026

## Project Overview
Rapid Fitness is a high-traffic gym with 1,200 active members and a staff of 15 specialized trainers. Currently, the gym manages over 50 unique group classes per week and tracks an inventory of 200+ pieces of equipment using disorganized spreadsheets, leading to scheduling conflicts and double-booked machinery.

This project is a centralized database-driven web application designed to streamline operations. The system solves current data fragmentation by allowing staff to:
* Record **Class Enrollments** for members (Many-to-Many).
* Track **Trainer Assignments** to specific sessions (One-to-Many).
* Monitor the maintenance status of **Equipment Records** and their class assignments (Many-to-Many).
* Perform seamless CRUD operations with partial-update capabilities natively handled via stored procedures.

## Technology Stack
* **Frontend:** HTML, CSS, Handlebars.js (`.hbs`)
* **Backend:** Node.js, Express.js
* **Database:** MySQL / MariaDB
* **Architecture:** Custom PL/SQL Stored Procedures for complex data routing and partial updates.

## Setup and Installation

### 1. Prerequisites
Ensure you have Node.js installed and are connected to the university engineering network to access the database cluster.

### 2. Environment Configuration
Create a `.env` file in the root directory of the project to securely store your database credentials. Do **not** commit this file to version control.
```env
DB_HOST=classmysql.engr.oregonstate.edu
DB_USER=your_username
DB_PASSWORD=your_secure_password
DB_NAME=your_database_name
PORT=5386
```
### 3. Database Initialization
Before running the application, the database must be initialized to ensure all foreign key constraints and stored procedures compile correctly:
1. **Import `ddl.sql`:** This builds the required tables, relationships, and schema constraints.
2. **Import `pl.sql`:** This compiles all required stored procedures used for application routing and partial updates.
3. **Import `dml.sql`:** This populates the database with the baseline sample data for testing.

### 4. Running the Application
Once the database is configured and your `.env` file is set, install the required Node dependencies and start the Express server:

```bash
npm install
node app.js
```
The application will be accessible at http://classwork.engr.oregonstate.edu:5386/

## Citations and Acknowledgements

**Starter Code & Architecture:**
* The core Express routing schema, Handlebars integration, and database connector setups were adapted from the provided course Starter Code Templates.
* **Date:** 05/07/2026 - 05/20/2026
* **Source URLs:** * https://canvas.oregonstate.edu/courses/2042369/assignments/10464646
  * https://canvas.oregonstate.edu/courses/2042369/pages/exploration-implementing-cud-operations-in-your-app

**Artificial Intelligence Citations:**
Throughout the implementation phase, artificial intelligence tools (Microsoft Copilot) was utilized to aid in designing complex database components. Specifically, these tools assisted in structuring the PL/SQL stored procedures (such as implementing `COALESCE` and `NULLIF` logic for partial updates) and debugging conditional edge cases for form submissions.
