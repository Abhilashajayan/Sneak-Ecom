const express = require('express');
const router = express.Router();
const mailerAuth = require('../controllers/mailer');
const upload = require("../services/multer");
const userDas = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');



//get methods
router.get('/signup', userDas.signup);
router.get('/otp', userDas.emailotp);
router.get('/signin', userDas.signin);
router.get('/verify-email', userDas.signemail);
router.get('/forgot-password', userDas.forgorPass);
router.get('/change-password', userDas.changepassword);
router.get('/',userDas.userHome);
router.get('/product-Selection/:userId',authMiddleware, userDas.productData);
router.get('/shope-data', authMiddleware, userDas.shopPage);
router.get('/product-cart', authMiddleware, userDas.productCart);
router.get('/user-Dash',authMiddleware,userDas.userDash);
router.get('/users/address/:addressId',authMiddleware,userDas.addSearch);
router.get('/checkout',authMiddleware,userDas.checkOut);
router.get('/payment-success',authMiddleware,userDas.animation);
router.get('/empty-Cart',authMiddleware,userDas.emptyCart);
router.get('/SearchProduct/:inputField',userDas.SearchProduct);
router.get('/404',userDas.notfound);
router.get('/logout',authMiddleware,userDas.logout);
router.get('/checkCoupon/:promoCode',authMiddleware,userDas.couponCheck);
router.get('/loadMore/:page',authMiddleware,userDas.shopPage);
router.get('/contact',authMiddleware,userDas.contactUS);
router.get('/showOrder/:orderId',authMiddleware,userDas.showOrder);
router.get('/filterProduct',userDas.filterProduct);
router.get('/blocked',userDas.blocked);
//post methods

router.post('/Invoice',userDas.invoiceDownload);
router.post('/upload',authMiddleware, upload.single('userImage'), userDas.userImageAdd);
router.post('/signup',userDas.userRegister);
router.post('/verify-email',mailerAuth.registerMail); 
router.post('/otp-validate',mailerAuth.otpVerify);
router.post('/signin',userDas.userSignin);
router.post('/change-password',mailerAuth.changePass);
router.post('/users/:userId',authMiddleware,userDas.updateDash);
router.post('/updateAddress/:addressId',authMiddleware, userDas.editAddress);
router.post('/add-to-cart',authMiddleware,userDas.addToCart);
router.post('/add-address/:userId',authMiddleware,userDas.addAddress);
router.post('/update-quantity',userDas.increData);
router.post('/submit-order',authMiddleware,userDas.orderData);
router.post('/return-request/:orderId',authMiddleware,userDas.returnRequest);
router.post('/orders/:orderId/cancel',authMiddleware,userDas.cancelRequest);
router.post('/verify-payment',authMiddleware,userDas.verifyPayment);
router.post('/filterData',userDas.filterData);
router.post('/address/:addressId',authMiddleware,userDas.userDelete);
router.post('/removeCart',authMiddleware,userDas.removedProductCart);



module.exports = router;