const jwt = require('jsonwebtoken')
const User = require('../models/user-model');
const { user } = require('../controllers/auth-controllers');

const authMiddleware = async (req, res, next)=>{
    const token = req.header('Authorization');

    if(!token){
        return res.status(200).json({msg: "Unauthorized HTTP, Token not provided"})
    }

    const jwtToken = token.replace('Bearer','').trim();

    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY)
        const userData = await User.findOne({email: isVerified.email}).select({password: 0});

        req.user = userData;
        req.token = token;
        req.userID = userData._id;

        next();
    } catch (error) {
        return res.status(401).json({msg: "Unauthorize, Invalid token"})
    }
}

module.exports = authMiddleware;