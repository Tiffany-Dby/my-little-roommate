# My Little Roommate - Backend API

**My Little Roommate** is a backend API designed to manage shared housing tasks and expenses. It provides endpoints for member management, expense tracking, and payment handling.

---

## Features

### Member Management

- **Add/Remove Members**: Only the rental admin can add or remove members from the rental.
- **Transfer Rental Admin**: The current admin can assign a new admin from the rental members.

### Expense Management

- **Add/Remove Charges**: Track expenses such as rent, utilities, and groceries, specifying who paid.
- **Split Expenses**: Automatically divide expenses among members, allowing for flexible splits (e.g., partial amounts).
- **Payment Tracking**: Mock payments between members and log the transactions.

### Payment History

- View the history of all transactions and reimbursements within the rental.

---

## Installation

### Prerequisites

- Node.js
- npm or yarn
- MySQL
- MongoDB

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Tiffany-Dby/my-little-roommate.git
   cd my-little-roommate
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment, in a `.env` file with the following variables:

   ```bash
   PORT=

   # DATABASE
   DB_HOST=
   DB_PORT=
   DB_USER=
   DB_PASSWORD=
   DB_NAME=

   # JWT
   JWT_DURATION=
   JWT_SECRET=
   JWT_REFRESH_DURATION=
   JWT_REFRESH_SECRET=
   ```

4. Start the server:
   ```bash
   npm rund dev
   ```

## API Endpoints

### User Management

- **Register a new user**:  
  `POST /api/users/register`

- **Login a user**:  
  `POST /api/users/login`  
  Authenticates a user and returns an access and a refresh token.

- **Add a member to a rental** (admin only):  
  `POST /api/users/:memberId/rental/:rentalId`

- **Transfer rental admin** (admin only):  
  `PATCH /api/users/:memberId/rental/:rentalId`

- **Refresh access token**:  
  `GET /api/users/refresh-token`

- **Get logged-in user's details**:  
  `GET /api/users/get-me`

- **Get user's rentals by ID**:  
  `GET /api/users/:id/rentals`

- **Delete a user**:  
  `DELETE /api/users`

- **Remove a member from a rental** (admin only):  
  `DELETE /api/users/:memberId/rental/:rentalId`

- **Delete user's association with a rental**:  
  `DELETE /api/users/rental/:rentalId`

---

### Rental Management

- **Create a new rental**:  
  `POST /api/rentals`

- **Search rentals by criteria**:  
  `GET /api/rentals/search`

- **Get rental details by ID**:  
  `GET /api/rentals/:id`

---

### Expense Management (TODO)

- **Add a new charge**:  
  `POST /charges`

- **Mock a payment between members**:  
  `POST /charges/:id/pay`

- **List all charges for a rental**:  
  `GET /charges`

---

## Project Structure

```bash
src/
├── configs/           # Configs for databases
├── controllers/       # Route controllers for API logic
├── databases/         # Databases models/entities (TypeORM/MySQL)
├── middlewares/       # Validation and authentication middleware
├── repositories/      # Database interactions using TypeORM
├── services/          # Business logic and reusable methods
├── types/             # TypeScript types and DTOs/Inputs/Presenters
├── utils/             # Utility functions
├── routes/            # API route definitions
├── app.ts             # Express app configuration (middlewares, routes, error handling)
└── server.ts          # Main entry point: initializes DBs, starts the server
```

---

## Notes

- This is the backend API only. It does not include a frontend interface.
- Payments are mocked and logged to the console for testing purposes.
- This is a School exercise.
