const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const signup  = (req, res) =>{
    res.render('userLogin/signup');
}


const signemail  = (req, res) => {

    res.render('userLogin/signemail');
   
};


const signin = (req, res) => {
    res.render('userLogin/Login');
};


const emailotp = (req, res) => {
  const email = req.session.email;
    res.render('userLogin/otp',{email});
};


const forgorPass = (req, res) => {
    res.render('userLogin/forgotpass');
};


const changepassword = (req, res) => {
    res.render('userLogin/changePass');
};


const userRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (username && email && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      req.session.userData = { username, email, password: hashedPassword };
      console.log(hashedPassword);
    }

    res.redirect('verify-email');
  } catch (error) {
    res.status(501).json({ error: "some error" });
  }
};


const userSignin = async (req, res) => {
  try {
    const { Lusername, Lpassword } = req.body;
    const user = await User.findOne({ username: Lusername });

    if (!user) {
      const error = 'Check user username';
      return res.render('userLogin/Login', { error });
    }

    const passwordMatch = await bcrypt.compare(Lpassword, user.password);
    if (passwordMatch) {
      const payload = {
        userId: user._id,
        email: user.email,
        username: user.username,
        status: user.status 
      };
      
      const secretKey = process.env.SECRET_KEY; 
      const token = jwt.sign(payload, secretKey, { expiresIn: '5m' });

      res.cookie('jwt', token, { httpOnly: true, maxAge: 300000 }); 
      res.redirect('/');
    } else {
      const error = 'Password is incorrect';
      res.render('userLogin/Login', { error });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};






module.exports = {
    signup,
    signemail,
    signin,
    emailotp,
    forgorPass,
    changepassword,
    userRegister,
    userSignin

};