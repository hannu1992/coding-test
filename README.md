# Inventory Management – Coding Test

This project is a simple full-stack inventory application built as part of a take-home assignment.

It includes:

- Backend: REST API for product management
- Frontend: Inventory dashboard to manage products

---

## Tech Stack

**Backend**

- Node.js
- Express
- Knex
- SQLite

**Frontend**

- HTML
- Bootstrap 5
- Vanilla JavaScript (Fetch API)

---

## Project Structure

project-root/
├── backend/
│ ├── routes/
│ ├── services/
│ ├── models/
│ ├── utils/
│ ├── middleware/
│ ├── migrations/
│ ├── db/
│ └── index.js
│
├── frontend/
│ ├── index.html
│ └── script.js
│
└── README.md

---

## Backend Setup

### 1. Navigate to backend

```
cd backend
```

### 2. Install dependencies

```
npm install
```

### 3. Run migrations

```
npx knex migrate:latest
```

### 4. Start server

```
npm start
```

Server will run at:
http://localhost:3000

---

## API Endpoints

| Method | Endpoint      | Description                                      |
| ------ | ------------- | ------------------------------------------------ |
| GET    | /products     | List products (supports `name`, `sort`, `order`) |
| GET    | /products/:id | Get product                                      |
| POST   | /products     | Create product                                   |
| PUT    | /products/:id | Update product                                   |
| DELETE | /products/:id | Delete product                                   |
| GET    | /health       | Health check                                     |

### Response Format

{
success: true/false,
code: number,
message: string,
data: any
}

---

## Frontend Setup

Open the frontend directly:
frontend/index.html

Or serve with any static server.
http://localhost/project-root/frontend

The frontend connects to:
http://localhost:3000

## Features

- Add product
- Edit name and quantity
- Delete with confirmation modal
- Search by name
- Sort by name or quantity
- Toast notifications for actions
- Loading states and error handling

---

## Notes

- Data is stored in SQLite (`backend/db/inventory.sqlite3`)
- Slug is generated from product name and must be unique
- Backend uses centralized error handling
- Frontend uses a reusable API helper for consistent responses

---
