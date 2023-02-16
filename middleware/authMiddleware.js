const jwt = require('jsonwebtoken');

const User = require('../models/user');
require('dotenv').config()

const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

            req.header = await User.findById(decoded._id).select('-password');
            next();

            
        } catch (error) {
            console.log(error);
            res.status(401).json({
                success: false,
                msg: 'Session Expired'
            })
        }
    }

    if (!token) {
       res.clearCookie("token")
      res.send({
        success: false,
        message: "Login required"
      })
    }
}

const userRoleAuth = async (req,res, next) =>{
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded._id);

            if(user.role === 2){
                next();
            }
            
        } catch (error) {
            console.log(error);
            res.status(401).json({
                success: false,
                msg: 'Session Expired'
            })
        }
    }

    if (!token) {
       res.clearCookie("token")
       //return res.redirect(301,"http://localhost:3030/api/signin")
    }
}


module.exports = {protect, userRoleAuth};
