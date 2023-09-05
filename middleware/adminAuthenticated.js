const adminSign = require('../models/adminSchema');
const { compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;



const adminAuthenticated = async (req, res, next) => {
    const token = req.cookies.adminJwt;
  
    if (!token) {
      return res.redirect('/admin-Login');
    }
  
    try {
      const verifiedAdmin = jwt.verify(token, secretKey);

      console.log(verifiedAdmin);
      req.admin = verifiedAdmin.admin;
      next();
    } catch (err) {
      res.redirect('/admin-Login');
      console.log(err);
    }
  };
  
  module.exports = adminAuthenticated;