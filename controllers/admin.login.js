const adminSign = require('../models/adminSchema');
const cloudinary = require("../services/cloudinary");
const upload = require("../services/multer");
const Product = require("../models/productSchema");
const User = require("../models/userSchema");
const Cata = require("../models/categorySchema");
const Order = require('../models/orderSchema');

const adminLog = (req,res) =>{
    res.render('adminLog/adminLog');
    
}

const dashboards = async (req,res) =>{

    try{
        const productData = await Product.find({}, {} );
        const categoryData = await Cata.find({},{});
        const userData = await User.find({},{});
        const orderData = await Order.find({});
        
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

         const totalSales = await Order.aggregate([
         { $group: { _id: null, totalAmount: { $sum: '$totalAmount' } } }
          ]);
          
          
           const today = new Date();
            today.setHours(0, 0, 0, 0);
             const todaysOrders = await Order.countDocuments({ createdOn: { $gte: today } });
             const dailySales = await Order.aggregate([
              {
                  $group: {
                      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdOn" } },
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

               
             res.render('adminLog/dashboard',{productData,userData,categoryData,orderData,totalProducts,totalOrders,totalSales,todaysOrders,dailySales,recentOrders});
    }catch(err){
        console.log(err);
    
}
}

const adminLogin = async (req,res) =>{
    try{
    const {ausername , password} = req.body;
    const user = await adminSign.findOne({ username: ausername });
    // console.log(user);
    if(user.username === ausername && user.password === password){
        res.redirect('/admin-dashboard');
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
      
      let products = new Product({
        productImages: uploadedImages ,
        productTitle: req.body.productTitle,
        productPrice: req.body.productPrice,
        discount: req.body.discount,
        stock: req.body.stock,
        productCategory:req.body.productCategory
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

    const { productTitle, productPrice, discount, stock } = req.body;
    const updateFields = { productTitle, productPrice, discount, stock };

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
    changeSts
}