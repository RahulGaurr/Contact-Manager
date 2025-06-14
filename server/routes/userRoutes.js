const express = require('express');
const { registerUser, loginUser, currentUser } = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');
const { validateUser } = require('../middleware/validate');

const router = express.Router()

router.post("/register", validateUser, registerUser)

router.post("/login", validateUser, loginUser)

router.get("/current", validateUser, validateToken, currentUser)

module.exports = router