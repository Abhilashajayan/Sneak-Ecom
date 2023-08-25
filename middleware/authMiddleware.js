const { compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; 

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
   res.redirect("/signin")
  }

  
    const decodedTokens = jwt.decode(token);
    const userStatus = decodedTokens.status;
    if(!userStatus){
        try {
        const decodedToken = jwt.verify(token, secretKey);
       
        req.user = decodedToken; 
        req.userId = decodedToken.userId;
        next(); 
        console.log("verrified user: ");
        
      } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
      }
    }else{
        const error = "you are blocked by admin";
        res.render('userLogin/Login',{ error });
        console.log(blocked);
    }
   
};

module.exports = authMiddleware;
