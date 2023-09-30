const adminSign = require('../models/adminSchema');
const cloudinary = require("../services/cloudinary");
const upload = require("../services/multer");
const Product = require("../models/productSchema");
const User = require("../models/userSchema");
const PDFDocument = require('pdfkit');
const Cata = require("../models/categorySchema");
const Order = require('../models/orderSchema');
const Returns = require('../models/returnSchema');
const Coupon = require('../models/couponSchema');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const adminLog = (req,res) =>{
    res.render('adminLog/adminLog');
    
}

const dashboards = async (req,res) =>{
  const itemsPerPage = 6;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * itemsPerPage;

  const itemsPerPages = 6;
  const pages = parseInt(req.query.page) || 1;
  const skips = (pages - 1) * itemsPerPages;

    try{
      const orderData = await Order.find().skip(skip).limit(itemsPerPage);
      const productData = await Product.find().skip(skips).limit(itemsPerPages);
      const totalUsers = await Order.countDocuments();
      const totalUserss = await Product.countDocuments();
      const totalOrderPages = Math.ceil(totalUsers / itemsPerPage);
      const totalOrderPagess = Math.ceil(totalUserss / itemsPerPages);
        const categoryData = await Cata.find({},{});
        const userData = await User.find({},{});
        // const orderData = await Order.find({});
        const Return = await Returns.find({},{});
        const CoupenData = await Coupon.find({},{});
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const weeklySalesData = await Order.aggregate([
          {
            $project: {
              dayOfWeek: { $dayOfWeek: "$createdOn" }, // Get the day of the week (1 = Sunday, 2 = Monday, ..., 7 = Saturday)
              totalAmount: "$totalAmount"
            }
          },
          {
            $group: {
              _id: "$dayOfWeek",
              totalAmount: { $sum: "$totalAmount" }
            }
          }
        ]);
        
        const weeklySales = Array(7).fill(0);
        weeklySalesData.forEach(data => {
          const dayOfWeek = data._id - 1; 
          weeklySales[dayOfWeek] = data.totalAmount;
        });
        console.log(weeklySales, " the sales");


        const todays = new Date(); 
        const sevenDaysAgo = new Date(todays);
        sevenDaysAgo.setDate(todays.getDate() - 6);
        
        const dailyOrdersData = await Order.aggregate([
          {
            $match: {
              createdOn: {
                $gte: sevenDaysAgo,
                $lte: todays, 
              },
            },
          },
          {
            $project: {
              dayOfWeek: { $dayOfWeek: "$createdOn" }, // Get the day of the week (1 = Sunday, 2 = Monday, ..., 7 = Saturday)
            },
          },
          {
            $group: {
              _id: "$dayOfWeek",
              count: { $sum: 1 }, // Count the number of orders for each day
            },
          },
        ]);
        
        // Create an array to store daily order count for the last seven days
        const dailyOrdersCountLastSevenDays = Array(7).fill(0);
        
        dailyOrdersData.forEach((data) => {
          const dayOfWeek = data._id - 1; // Adjust to be zero-based
          dailyOrdersCountLastSevenDays[dayOfWeek] = data.count;
        });
        
 
        




        



         const totalSales = await Order.aggregate([
         { $group: { _id: null, totalAmount: { $sum: '$totalAmount' } } }
          ]);
          
          const totalSaless = totalSales[0].totalAmount;
           const today = new Date();
            today.setHours(0, 0, 0, 0);
             const todaysOrders = await Order.countDocuments({ createdOn: { $gte: today } });
             const dailySales = await Order.aggregate([
              {
                  $group: {
                      _id: { $dateToString: {  date: "$createdOn" } },
                      todays: { $sum: "$totalAmount" }
                  }
              },
              {
                  $sort: { _id: 1 }
              }
          ]);

          const recentOrders = await Order.find({})
          .sort({ createdOn: -1 }) 
           .limit(4);
           console.log(recentOrders);

             req.session.salesReportData = [totalOrders,totalSaless,todaysOrders];
             console.log(req.session.salesReportData);
             res.render('adminLog/dashboard',{productData,userData,categoryData,orderData,totalProducts,totalOrders,totalSales,todaysOrders,dailySales,recentOrders,Return,weeklySales,dailyOrdersCountLastSevenDays,CoupenData,totalOrderPages,currentPage:page, totalOrderPagess ,currentPages:pages});
    }catch(err){
        console.log(err);
    
}
}


const adminLogin = async (req,res) =>{
    try{
    const {ausername , password} = req.body;
    const user = await adminSign.findOne({ username: ausername });
    if(user.username === ausername && user.password === password){
     

        const payload = {
        userId: user._id,
        username: user.username,
        };
        console.log(payload);
        const secretKey = process.env.SECRET_KEY; 
        const token = jwt.sign(payload, secretKey, { expiresIn: '5m' });
  
        res.cookie('adminJwt', token, { httpOnly: true, maxAge: 300000 }); 
        res.redirect('/admin-Dashboard');
  
      } else {
        const error = 'Password is incorrect';
      }
      
    }catch(e){
      console.log(e);
 }
}


const imageAdd =  async (req, res) => {
    try {
      const files = req.files;
      const uploadedImages = await Promise.all(files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return {
          secure_url: result.secure_url,
          cloudinary_id: result.public_id
        };
      })); 

      const selectedSizes = req.body.sizes; // Retrieve the selected sizes directly from req.body

      console.log('Selected Sizes:', selectedSizes);
     
      const products = new Product({
        productImages: uploadedImages ,
        productTitle: req.body.productTitle,
        productPrice: req.body.productPrice,
        discount: req.body.discount,
        stock: req.body.stock,
        productCategory:req.body.productCategory,
        sizes: selectedSizes
      });
      await products.save();
      res.status(200)
      console.log("product added successfully");
      res.redirect('/admin-dashboard');
    } catch (err) {
      console.log(err);
      res.status(501);
    }
};



const adminEditPrt = async (req, res) => {
    try {
      const userId = req.params.userID; 
      
      console.log(userId, "User ID received");
      const product = await Product.findById(userId).exec();
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

// const updateData = async (req, res) => {
//   const userId = req.params.userId;
//   console.log(userId, "User ID received");
//   const { cloudinary_id } = req.body;
//   console.log(cloudinary_id, "Cloudinary ID received");


//   try {
//     let result ;
    
//     if (req.file && req.file.path !== undefined) {
//       result = await cloudinary.uploader.upload(req.file.path);
//       if (cloudinary_id) {
//         await cloudinary.uploader.destroy(cloudinary_id);
//       }
//     }
    

//     const { productTitle, productPrice, discount, stock  } = req.body;
//     const updateFields = { productTitle, productPrice, discount, stock };

//     const existingProduct = await Product.findOne({ _id: userId});

//     if (result && existingProduct.productImages.length > 0) {
     
//       existingProduct.productImages[0].secure_url = result.secure_url;
//       updateFields.productImages = existingProduct.productImages;
//     }
//     await Product.updateOne({ _id: userId }, updateFields);
//     res.redirect('/admin-dashboard')

//     console.log('Data updated successfully.');
//   } catch (error) {
//    res.status(500);
//    console.log(error);
//   }
// };

const updateData = async (req, res) => {
  const userId = req.params.userId;
  console.log(userId, "User ID received");
  const { cloudinary_id } = req.body;
  console.log(cloudinary_id, "Cloudinary ID received");

  try {
    let result;
    
    if (req.file && req.file.path !== undefined) {
      result = await cloudinary.uploader.upload(req.file.path);
      if (cloudinary_id) {
        await cloudinary.uploader.destroy(cloudinary_id);
      }
    }

    const { productTitle, productPrice, discount, stock , isListed  } = req.body;
    const updateFields = { productTitle, productPrice, discount, stock, isListed };

    const existingProduct = await Product.findOne({ _id: userId });

    if (result && existingProduct.productImages.length > 0) {
      existingProduct.productImages[0].secure_url = result.secure_url;
      updateFields.productImages = existingProduct.productImages;
    }

    await Product.updateOne({ _id: userId }, updateFields);
    console.log('Data updated successfully.');
    
    // Redirect after updating
    // res.redirect('/admin-dashboard');
    res.json("workkingggg")
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};



const deleteProduct = async (req, res) => {
        try {
          const id = req.params.userID;
          const deletedData = await Product.findByIdAndDelete(id);
          
          
          console.log('Deleted data:', deletedData);
          res.redirect('/admin-dashboard');
    
        } catch (error) {
          console.error('Error deleting data:', error);
          res.status(500).send('Error deleting data');
        }
    }

const blockUser = async (req, res) => {
  const userId = req.params.userId;
    console.log('Block user:', userId);
    try {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
      
        user.status = !user.status;
        await user.save();
        console.log("user is blocked");
        res.json({ message: 'User status updated successfully' });
      } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };



const addCatagory = async (req, res) => {
        try {
            const { categoryName } = req.body;
            const newCategory = new Cata({
                categoryName: categoryName
            });
    
            const savedCategory = await newCategory.save();
            res.redirect("/admin-dashboard");
            res.status(201);
        } catch (error) {
            console.error('Error adding category:', error);
            res.status(500).json({ message: 'Failed to add category' });
        }
    };
    



const cataCheck = async (req, res) => {
      const categoryName = req.params.categoryName;

      try {
        const category = await Cata.findOne({ categoryName: categoryName });
    
        if (category) {
          res.json({ exists: true });
        } else {
          res.json({ exists: false });
        }
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
      }
    }


const changeSts = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    console.log(status);
    
    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: status },
        { new: true } 
    );
    if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
    }

} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
}
};


const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try{
    const user = await User.findByIdAndDelete(userId);
    console.log(user,"user is deleted");
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

const cataDelete = async (req, res) => {
  try {
    const cataId = req.params.categoryId;
    console.log(cataId);

    const category = await Cata.findById(cataId);
   
    console.log(category);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const categoryName = category.categoryName;
    await Product.deleteMany({ productCategory: categoryName });
    const cataDel = await Cata.findByIdAndDelete(cataId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const returnReq = async (req, res) => {
  const returnId = req.params.returnId;
  const { isApproved } = req.body;

  try {
    const returnRequest = await Returns.findById(returnId);

    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' });
    }
    returnRequest.isWholeOrder = isApproved;
    returnRequest.status = isApproved ? 'Approved' : 'Rejected';
    await returnRequest.save();

    res.status(200).json({ message: 'Return request updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const coupenCode = async (req, res) => {
  const { couponCode, expiryDate, amount, minPurchase } = req.body;

  // Create a new coupon instance
  const newCoupon = new Coupon({
    couponCode: couponCode,
    expiryDate: expiryDate,
    discountAmount: amount,
    minPurchase: minPurchase,
  });
  try {
    const savedCoupon = await newCoupon.save();
    console.log('Coupon added successfully:', savedCoupon);
    res.redirect('/admin-dashboard');
  } catch (error) {
    console.error('Failed to add coupon:', error);
    res.status(500).send('Failed to add coupon');
  }
};


const deleteCoupon = async (req, res) => {
  const coupID = req.params.coupID;
  try{
    const CoupenData = await Coupon.findByIdAndDelete(coupID);
    console.log(CoupenData,"user is deleted");
    res.redirect('/admin-dashboard');
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
}


const editCoupon = async (req, res) => {
  const couponId = req.params.coupID;
  try{
    const coupon = await Coupon.findById(couponId).exec();
  
      if (!coupon) {
        return res.status(404).json({ error: 'Product not found' });
      }
      console.log(coupon);
      res.json(coupon);

  }catch (error) {
    console.error(error);
  }
  
}
  

const postCoponEdit = async (req, res) => {
  const { coupId, couponCode, expiryDate, amount, minPurchase } = req.body;
  console.log(coupId);
  try {
    const coupon = await Coupon.findById(coupId);
    if (!coupon) {
      return res.status(404).send('Coupon not found');
    }
    coupon.couponCode = couponCode;
    coupon.expiryDate = expiryDate;
    coupon.amount = amount;
    coupon.minPurchase = minPurchase;
    await coupon.save();
    res.redirect('/admin-dashboard');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};


const salesReportManagement = (req, res) => {
  const salesReportData = req.session.salesReportData;

  try {
    const doc = new PDFDocument();
    doc.info.Title = 'Sales Report';
    doc.info.Author = 'Sneak Ecommerce Pvt. Ltd';
    doc.fontSize(18).text('Sales Report', { align: 'center' });
    doc.fontSize(14).text('Sneak Ecommerce Pvt. Ltd', { align: 'center' });
    doc.moveDown();
    const currentDate = new Date().toLocaleDateString('en-US');
    doc.fontSize(12).text('Date: ' + currentDate, { align: 'center' });

    doc.moveDown();
    doc.moveDown();
    doc.fontSize(12).text('This report provides a summary of our sales data for the given period.', { align: 'center' });
    
    doc.moveDown();
    doc.fontSize(16).text('Total Sales: $' + salesReportData[1].toFixed(2));
    doc.fontSize(16).text('Total Orders: ' + salesReportData[0]);
    doc.fontSize(16).text("Today's Orders: " + salesReportData[2]);
    doc.moveDown();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="sales-report.pdf"');
    doc.pipe(res);
    doc.end();
    console.log('PDF report generated and sent for download.');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const adlogout = async (req, res) => {

  res.clearCookie('adminJwt');

  res.redirect("/admin-Login")
};


const editCatas  = async (req, res) => {
  const orderID  = req.params.orderID;
  try {
    const order = await Cata.findOne({ _id: orderID });
    console.log(order);
    res.json(order);
  console.log(orderID,"this isthe order d and this ");
}catch(err){
  console.log(err);
}
}


const updateCategory = async (req, res) => {
  const categoryId = req.body.categoryId;
  const updatedCategoryName = req.body.categoryName;

  console.log(updatedCategoryName);
  try {
    const updatedCategory = await Cata.findOneAndUpdate(
      { _id: categoryId }, 
      { categoryName: updatedCategoryName }, 
      { new: true } 
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    console.log('Category updated:', updatedCategory);
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports = {
    adminLog,
    adminLogin,
    dashboards,
    adminEditPrt,
    updateData,
    addCatagory,
    deleteProduct,
    blockUser,
    imageAdd,
    cataCheck,
    changeSts,
    deleteUser,
    cataDelete,
    returnReq,
    coupenCode,
    deleteCoupon,
    editCoupon,
    postCoponEdit,
    salesReportManagement,
    adlogout,
    editCatas,
    updateCategory
}