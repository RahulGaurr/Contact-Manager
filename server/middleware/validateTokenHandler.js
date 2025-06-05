// middleware to verify the token send-by/generated-for client/user to access /current route
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')


const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                res.status(401);
                throw new Error ("User is not authorized")
            }
           // console.log(decoded) // the user info embeded in the token
            req.user = decoded.user // appended/attached the user info on the req.user property decoded from token.
            next()
        });

        if(!token) {
            res.status(401)
            throw new Error("User is not not authorized pr token is missing")
        }
    }
})

module.exports = validateToken;