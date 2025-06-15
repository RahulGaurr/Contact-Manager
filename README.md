Contact Manager 📋✨
A full-stack contact management app built with React and Node.js! 🚀 Manage your contacts with ease, featuring user authentication, CRUD operations, and a sleek UI. 😎

Table of Contents 📑

Features 🌟
Tech Stack 🛠️
Directory Structure 📂
Installation 🔧
Usage 📲
Contributing 🤝
License 📜

Features 🌟

🔐 User authentication (signup & login)
📝 Create, read, update, and delete contacts (CRUD)
🛡️ Protected routes for authenticated users
✅ Input validation & error handling
⏳ Debounced search for smooth performance
📱 Responsive frontend with React components

Tech Stack 🛠️

Frontend: React ⚛️, Vite ⚡, Tailwind CSS 🎨
Backend: Node.js 🟢, Express.js 🚀
Database: MongoDB 🍃 (server/config/dbConnection.js)
Others: ESLint 📏, Vercel 🚀, JWT 🔑

Directory Structure 📂
rahulgaurr-contact-manager/
├── README.md 📄
├── client/ 🌐
│   ├── README.md 📄
│   ├── eslint.config.js 📏
│   ├── index.html 🏠
│   ├── package-lock.json 🔒
│   ├── package.json 📦
│   ├── vercel.json ☁️
│   ├── vite.config.js ⚡
│   ├── .gitignore 🙈
│   └── src/ 📁
│       ├── App.css 🎨
│       ├── App.jsx ⚛️
│       ├── index.css 🎨
│       ├── main.jsx 🚀
│       ├── components/ 🧩
│       │   ├── Dashboard.jsx 📊
│       │   ├── Login.jsx 🔐
│       │   ├── ProtectedRoute.jsx 🛡️
│       │   └── Signup.jsx 📝
│       ├── contexts/ 🗂️
│       │   └── AuthContext.jsx 🔐
│       ├── hooks/ 🎣
│       │   └── useDebounce.js ⏳
│       └── utils/ 🛠️
│           └── validators.js ✅
└── server/ 🖥️
    ├── constants.js ⚙️
    ├── package-lock.json 🔒
    ├── package.json 📦
    ├── server.js 🚀
    ├── .gitignore 🙈
    ├── config/ 🔧
    │   └── dbConnection.js 🗄️
    ├── controllers/ 🎮
    │   ├── contactController.js 📋
    │   └── userController.js 👤
    ├── middleware/ 🛡️
    │   ├── errorHandler.js 🚨
    │   ├── validate.js ✅
    │   └── validateTokenHandler.js 🔑
    ├── models/ 🗃️
    │   ├── contactModel.js 📋
    │   └── userModel.js 👤
    └── routes/ 🛤️
        ├── contactRoutes.js 📋
        └── userRoutes.js 👤

Installation 🔧

Clone the repo 📥:
git clone https://github.com/rahulgaurr/rahulgaurr-contact-manager.git
cd rahulgaurr-contact-manager


Install dependencies 📦:

For the client:cd client
npm install


For the server:cd server
npm install




Set up environment variables ⚙️:

Create a .env file in server/ and add:MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000




Start the app 🚀:

Server:cd server
npm run dev


Client:cd client
npm run dev





Usage 📲

Open your browser 🌐 and go to http://localhost:5173 (or Vite’s port).
Sign up 📝 or log in 🔐.
Manage contacts on the dashboard 📊 (create, update, delete, search).

Contributing 🤝
We love contributions! 💖 Follow these steps:

Fork the repo 🍴.
Create a branch 🌿 (git checkout -b feature/your-feature).
Commit changes 📝 (git commit -m 'Add your feature').
Push to the branch 🚀 (git push origin feature/your-feature).
Open a pull request 🙌.

License 📜
This project is licensed under the MIT License. 🎉
