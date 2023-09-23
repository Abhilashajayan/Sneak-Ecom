const express = require('express');
const router = express.Router();
const adminDatas = require('../controllers/adminController');
const cloudinary = require("../services/cloudinary");
const upload = require("../services/multer");
const Product = require("../models/productSchema");
const myMiddleware = require('../middleware/adminAuthenticated');


router.get('/admin-Login', adminDatas.adminLog);
router.get('/admin-dashboard',myMiddleware, adminDatas.dashboards);
router.get('/api/users/:userID', adminDatas.adminEditPrt);
router.get('/category/:categoryName', adminDatas.cataCheck)
router.get('/getCoupon/:coupID',adminDatas.editCoupon);
router.get('/logouts', adminDatas.adlogout);
router.get('/salesReportManagement', adminDatas.salesReportManagement);
router.get('/editCata/:orderID', adminDatas.editCatas);
// post method
router.post('/admin-Login', adminDatas.adminLogin);
router.post('/admin-add-product', upload.array("productImages"), adminDatas.imageAdd);
router.post('/api/users/update/:userId', upload.single("productImage"), adminDatas.updateData);
router.post('/api/block-user/:userId', adminDatas.blockUser);
router.post('/add-category', adminDatas.addCatagory);
router.post('/api/return-requests/:returnId', adminDatas.returnReq)
router.post('/addCoupon', adminDatas.coupenCode);
router.post('/editCoupon', adminDatas.postCoponEdit);
router.put('/update-category', adminDatas.updateCategory);


// put method
router.put('/updateDeliveryStatus/:orderId', adminDatas.changeSts);


// delete
router.delete('/delete-category/:categoryId', adminDatas.cataDelete);
router.delete('/api/delete/:userID', adminDatas.deleteProduct);
router.delete('/delete-user/:userId', adminDatas.deleteUser);
router.delete('/delete-coupen/:coupID', adminDatas.deleteCoupon);
module.exports = router;
