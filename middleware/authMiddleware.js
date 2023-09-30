
const { compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const User = require('../models/userSchema');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.redirect("/signin");
  }

  const decodedToken = jwt.decode(token);

  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    req.userId = decodedToken.userId;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userStatus = user.status;

    if (!userStatus) {
      const refreshToken = jwt.sign({
        userId: user.id,
      }, secretKey, {
        expiresIn: "1 day",
      });

      // Set the refresh token in the cookie
      res.cookie('refreshToken', refreshToken);
      next();
      console.log("Verified user:", user);
    } else {
      res.clearCookie('jwt');
      const error = "You are blocked by admin";
      res.render('userLogin/Login', { error });
      
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = authMiddleware;

