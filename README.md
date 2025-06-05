# 📁 Project: `rahulgaurr-contact-manager`

A full-stack **Contact Manager web application** built with a React frontend and Node.js + Express backend. The app allows users to register, log in, and manage their personal contacts securely, using JWT-based authentication. MongoDB is used as the database.

---

## 🔧 Tech Stack

- **Frontend**: React, Vite, JSX, Tailwind/Custom CSS  
- **Backend**: Node.js, Express, MongoDB, Mongoose  
- **Auth**: JWT, Protected Routes, React Context  
- **Tooling**: ESLint, Git, GitHub

---

## 📂 Project Structure

rahulgaurr-contact-manager/
├── client/ → Frontend React app
└── server/ → Backend Express API


---

## 🧩 Key Features

### Frontend (`client/`)
- Built with **React + Vite**
- Components for `Login`, `Signup`, `Dashboard`, and `ProtectedRoute`
- `AuthContext` manages user auth globally
- Clean structure with `assets`, `components`, `contexts`, and styles

### Backend (`server/`)
- RESTful API with **CRUD operations** for contacts
- User authentication with **JWT**
- Custom **middleware** for error handling and token validation
- Organized code in folders: `controllers`, `models`, `routes`, `middleware`, `config`

---

## 📌 Example Routes

- `POST /api/users/register` – Register user  
- `POST /api/users/login` – Authenticate user  
- `GET /api/contacts/` – Get all contacts (protected)  
- `POST /api/contacts/` – Add a contact  


