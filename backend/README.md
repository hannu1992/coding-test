# Inventory API

A simple backend API to manage product inventory.

This project is built using:

- Node.js
- Express
- Knex
- SQLite

It supports basic CRUD operations with filtering and sorting.

---

## Setup Instructions

1. Install dependencies

```
npm install
```

2. Run database migrations

```
npm run migrate
```

3. Start the server

```
npm start
```

Server will run at:
http://localhost:3000

---

### Health Check

GET /health

Response:
{ "status": "OK" }
