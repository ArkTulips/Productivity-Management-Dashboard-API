#Productivity Management Dashboard API

A backend REST API for managing tasks, tracking productivity, and generating insights.
Built using Node.js, Express, PostgreSQL, and JWT authentication.

#Features
##Authentication & Authorization

User registration and login

JWT-based authentication

Secure password hashing using bcrypt

Users can access only their own data

##Task Management

Create, read, update, delete tasks

Task fields:

Title

Description

Priority (Low / Medium / High)

Status (Pending / In Progress / Completed)

Deadline

Tags / Categories

Tasks are linked to authenticated users

#Task Status & Deadline Handling

Automatically marks tasks as overdue

Manual status updates supported

Stores creation & update timestamps

## Search & Filtering

Search by title or description

Filter by:

Status

Priority

Deadline range

Tags

## Productivity Dashboard (API-Level)

Total tasks

Completed tasks

Overdue tasks

Completion rate

Tasks completed per day (last 7 days)

## Tech Stack

Backend: Node.js, Express.js

Database: PostgreSQL

Authentication: JWT

ORM/Driver: pg

Security: bcrypt, dotenv

Tools: Nodemon, Git

# Setup Instructions
## Clone the repository
git clone https://github.com/ArkTulips/Productivity-Management-Dashboard-API.git
cd task-1/server

## Install dependencies
npm install

## Configure environment variables

Create a .env file inside server/:

PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=productivity
JWT_SECRET=your_secret_key

## Start the server
npx nodemon index.js


Server runs on:

http://localhost:5000

# API Endpoints
Auth

POST /api/auth/register

POST /api/auth/login

Tasks

POST /api/tasks

GET /api/tasks

PUT /api/tasks/:id

DELETE /api/tasks/:id

All task routes require JWT in headers:

Authorization: Bearer <token>

Dashboard

GET /api/dashboard

Returns aggregated productivity metrics.

# Authentication Flow

User registers or logs in

Server returns JWT

JWT sent in Authorization header

Middleware validates token

User-specific data is returned

# Notes

RESTful API design

Secure access control

Modular route structure

Proper error handling and validation

# Author

Built by Sukrit Pal
