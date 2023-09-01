const express = require('express');
const router = express.Router();
const adminDatas = require('../controllers/admin.login');
const cloudinary = require("../services/cloudinary");
const upload = require("../services/multer");
const Product = require("../models/productSchema");


router.get('/admin-Login', adminDatas.adminLog);
router.get('/admin-dashboard', adminDatas.dashboards);
router.get('/api/users/:userID', adminDatas.adminEditPrt);
router.get('/category/:categoryName', adminDatas.cataCheck)
// post method
router.post('/admin-Login', adminDatas.adminLogin);
router.post('/admin-add-product', upload.array("productImages"), adminDatas.imageAdd);
router.post('/api/users/update/:userId', upload.single("productImage"), adminDatas.updateData);
router.post('/api/block-user/:userId', adminDatas.blockUser);
router.post('/add-category', adminDatas.addCatagory);
// put method
router.put('/updateDeliveryStatus/:orderId', adminDatas.changeSts);

// delete
router.delete('/delete-category/:categoryId', adminDatas.cataDelete);
router.delete('/api/delete/:userID', adminDatas.deleteProduct);
router.delete('/delete-user/:userId', adminDatas.deleteUser);
module.exports = router;
