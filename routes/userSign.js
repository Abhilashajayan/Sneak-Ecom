const express = require('express');
const router = express.Router();
const signinCont = require('../controllers/user.signin');
const mailerAuth = require('../controllers/mailer');
const userDas = require('../controllers/userDash');
const authMiddleware = require('../middleware/authMiddleware');



//get methods
router.get('/signup', signinCont.signup);
router.get('/otp', signinCont.emailotp);
router.get('/signin', signinCont.signin);
router.get('/verify-email', signinCont.signemail);
router.get('/forgot-password', signinCont.forgorPass);
router.get('/change-password', signinCont.changepassword);
router.get('/',authMiddleware,userDas.userHome);
router.get('/product-Selection/:userId',authMiddleware, userDas.productData);
router.get('/shope-data', authMiddleware, userDas.shopPage);
router.get('/product-cart', authMiddleware, userDas.productCart);
router.get('/user-Dash',authMiddleware,userDas.userDash);
router.get('/users/address/:addressId',authMiddleware,userDas.addSearch);
router.get('/checkout',authMiddleware,userDas.checkOut);
router.get('/payment-success',authMiddleware,userDas.animation);


//post methods
router.post('/signup',signinCont.userRegister);
router.post('/verify-email',mailerAuth.registerMail); 
router.post('/otp-validate',mailerAuth.otpVerify);
router.post('/signin',signinCont.userSignin);
router.post('/change-password',mailerAuth.changePass);
router.post('/users/:userId',authMiddleware,userDas.updateDash);
router.post('/updateAddress/:addressId',authMiddleware, userDas.editAddress);
router.post('/add-to-cart',authMiddleware,userDas.addToCart);
router.post('/add-address/:userId',authMiddleware,userDas.addAddress);
router.post('/update-quantity',userDas.increData);
router.post('/submit-order',authMiddleware,userDas.orderData);
module.exports = router;