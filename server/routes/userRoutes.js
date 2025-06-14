const express = require('express');
const { registerUser, loginUser, currentUser } = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');
const { validateUser, validateLogin } = require('../middleware/validate');


const router = express.Router()

router.post("/register", validateUser, registerUser)

router.post("/login", validateLogin, loginUser)

router.get("/current",  validateToken, currentUser)

module.exports = router