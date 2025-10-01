# 💰 Expense Tracker API

A simple and secure Expense Tracker API built with **Node.js**, **Express.js**, **Sequelize ORM**, **PostgreSQL**, and **JWT-based authentication**.  
This project allows users to register, log in, manage categories, record expenses, and generate monthly reports.

---

## 📂 Project Structure

```bash
expense-tracker/
├── src/
│   ├── app.js              # Express app entry point
│   ├── config/
│   │   └── db.js           # Sequelize database connection
│   ├── models/             # Sequelize models
│   │   ├── User.js
│   │   ├── Category.js
│   │   └── Expense.js
│   ├── routes/             # Express route definitions
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── expenses.js
│   │   └── reports.js
│   ├── controllers/        # Route controllers (business logic)
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── expenseController.js
│   │   └── reportController.js
│   ├── middleware/         # Authentication middleware
│   │   └── authMiddleware.js
│   └── utils/
│       └── validator.js     
├── .env                    # Environment variables
├── package.json
└── README.md


---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL (via Sequelize ORM)  
- **Authentication:** JWT (jsonwebtoken) + bcrypt password hashing  
- **Environment Management:** dotenv  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://gitlab.com/your-username/expense-tracker.git
cd expense-tracker

### 2️⃣ Install Dependencies

```bash
npm install

### 3️⃣ Configure Environment Variables

Create a .env file in the root directory:
```bash
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/expense_tracker
JWT_SECRET=your_jwt_secret_here

### 4️⃣ Start the Server
```bash
npm run dev

The API should now be available at:
http://localhost:5000