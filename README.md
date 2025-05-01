# ⭐ Store Rating Platform

A full-stack web application where users can rate stores, and system administrators and store owners can manage data and view analytics.

---

## 🚀 Tech Stack

- **Frontend**: React.js + Tailwind CSS + Vite  
- **Backend**: Express.js + Mongoose (MongoDB)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Package Management**: npm
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons

---

## 🔐 User Roles

1. **System Administrator**
2. **Normal User**
3. **Store Owner**

---

## 🛠 Functionalities

### 🧑‍💼 System Administrator
- Add new stores, normal users, and admin users.
- View dashboard:
  - Total users
  - Total stores
  - Total ratings
- View & filter:
  - Store List (Name, Email, Address, Rating)
  - User List (Name, Email, Address, Role)
- View detailed user info including their ratings if they are store owners.
- Logout.

### 👤 Normal User
- Signup with name, email, address, password.
- Login and update password.
- View & filter all stores by name/address.
- Submit or update ratings (1–5) for stores.
- Logout.

### 🏪 Store Owner
- Login and update password.
- Dashboard to:
  - View all users who rated their store.
  - See average store rating.
- Logout.

---

## ✅ Validations

- **Name**: Min 20 characters, Max 60 characters
- **Address**: Max 400 characters
- **Password**: 8–16 characters, with at least one uppercase letter and one special character
- **Email**: Must follow standard email format

---

## 📊 Extra Features

- Sorting for all tables by fields like name, email, etc.
- Clean responsive UI using Tailwind CSS.
- Error handling and alerts across actions.
- JWT-based authentication with role-based authorization.

---

## 🧪 Scripts

### Backend (`/backend/package.json`)
```bash
npm run start:dev # Run server with nodemon (dev mode)

```
### Frontend (`/frontend/package.json`)
```
npm run dev
