const admin = require('../admin');

const jwt = require('jsonwebtoken');


const requireAuth = async (req,res,next) => {
    const { authorization } = req.headers;   
    
    if(!authorization){
        res.json({msg:'Token required'})
    }

    const token = authorization.split(' ')[1]

    try{
        const {_id} = jwt.verify(token,process.env.JWT_SECRET)    
        next();
    }
    catch(err){
        res.status(401).json({msg:'Token is not valid'})
    }
    
}

module.exports = requireAuth;