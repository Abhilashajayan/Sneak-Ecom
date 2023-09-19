const Product = require('../models/productSchema');
const User = require('../models/userSchema');
const cata = require('../models/categorySchema');
const Cart = require('../models/cartSchema');
const Order = require('../models/orderSchema');
const OrderReturn = require('../models/returnSchema');
const Wallet = require('../models/walletSchema');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cloudinary = require("../services/cloudinary");
const upload = require("../services/multer");
require('dotenv').config();
const PDFDocument = require('pdfkit');
const fs = require('fs');       
const Coupon  = require('../models/couponSchema');
const jwt = require('jsonwebtoken');


const instance = new Razorpay({
  key_id: process.env.RAZOR_KEY,
  key_secret: process.env.RAZOR_SECRET,
});


const userHome = async (req, res)=>{
    try{
        const userData = await Product.find({}).sort({ createdAt: -1 }).limit(8);
        const cartItems = await Cart.find({},{});
        let cartLength = 0;
        if (cartItems.length > 0 && cartItems[0].cartItems) {
          cartLength = cartItems[0].cartItems.length;
        }
        console.log(cartLength, "the length");
        res.render('userHome/userHome',{ userData , cartItems , cartLength });
    }
 
        catch(err){
            console.log(err);
        }
}


const productData = async (req, res) => {
    try {
      const productId = req.params.userId;
      const products = await Product.findById(productId);
      const cartItems = await Cart({},{});
      let cartLength = 0;
        if (cartItems.length > 0 && cartItems[0].cartItems) {
          cartLength = cartItems[0].cartItems.length;
        }
      res.render('userHome/addToCart',{products , cartItems ,cartLength});
      if (!products) {
        res.redirect('/404')
      }
  
      res.status(200);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


const shopPage = async (req, res) => {
  try{
    
    let ITEMS_PER_PAGE = 4;
    const page = parseInt(req.query.page) || 1; 
    ITEMS_PER_PAGE += (page - 1) * 4;
    const userData = await Product.find({ isListed: true })
      .limit(ITEMS_PER_PAGE);
  const cart = await Cart.find({},{});
  const cartItems = await cata.find({},{});
  let cartLength = 0;
    if (cart.length > 0 && cart[0].cartItems) {
      cartLength = cart[0].cartItems.length;
    }
  res.render('userHome/shopeList',{ userData, cartItems, cartLength , currentPage:page });
}
  
catch(err){
    console.log(err);
}
}


// const productCart = async (req, res) => {
//   try{
//     const userData = await Product.find({}, {} );
//   res.render('userHome/productCart',{ userData });
//   }
//   catch(err){
//     console.log(err);
// }
// }
const productCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.find({},{});
    const userCart = await Cart.findOne({ user: userId }).populate({
      path: "cartItems.product",
      model: "Product"
    });
    let cartLength = 0;
    if (cart.length > 0 && cart[0].cartItems) {
      cartLength = cart[0].cartItems.length;
    }
    
    if (!userCart) {  
      res.redirect('/empty-Cart');
    }

    const cartItems = userCart.cartItems;
    console.log(cartItems,"cartItems");
    res.render('userHome/productCart', { cartItems , cartLength });
  } catch (err) {
    console.error(err);
    
  }
};


const userDash = async (req, res) => {
  try{
    
    const userId = req.userId;
    const walletData = await Wallet.findOne({ userId: userId });
    const userData = await User.findById(userId);
    console.log(userData,"hfdhfad");
    const orders = await Order.find({ user: userId })
 
    .select('items.productTitle createdOn status totalAmount') 
    .populate('items.productId', 'productTitle');
    res.render('userAcc/user-dash',{userData,orders,walletData});
  }catch(err){
    console.log(err);
  }
  
}


const updateDash = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId, "user Id");
    const { username, email, phone } = req.body;
    const data = { username, email, phone };
    console.log(data);
    await User.findByIdAndUpdate(userId, data);

    console.log(userId, "user Id");
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
}


const addSearch = async (req, res) => {
  const addressId = req.params.addressId;
  const userId = req.userId;
  console.log(userId, "user Id");
  try {

    const user = await User.findById(userId);

    if (user) {
      const matchingAddress = user.addresses.find(address => address.id == addressId);
        console.log(matchingAddress.name, "address");
      if (matchingAddress) {
        console.log("Matching Address:", matchingAddress);

        return res.status(200).json({ address: matchingAddress });
      } else {
        console.log("Address not found for this user");
        return res.status(404).json({ error: "Address not found for this user" });
      }
    } else {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const addAddress = async (req, res) => {
  try {
    const userId = req.params.userId; 
  
    const { name, country, streetAddress, city, state, pincode } = req.body;
    const newAddress = { name, country, streetAddress, city, state, pincode };

    const addressData = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { addresses: newAddress } }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
};


const editAddress = async (req, res) => {
  const addressId = req.params.addressId;
  const userId = req.userId; // Use req.userId

  const { name, country, streetAddress, city, state, pincode } = req.body;
  const updatedAddress = {
    'addresses.$.name': name,
    'addresses.$.country': country,
    'addresses.$.streetAddress': streetAddress,
    'addresses.$.city': city,
    'addresses.$.state': state,
    'addresses.$.pincode': pincode,
  };
  console.log(updatedAddress);

  try {
    await User.updateOne(
      { _id: userId, 'addresses._id': addressId },
      { $set: updatedAddress }
    );
      console.log("success");
    res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while updating the address' });
  }
};


const addToCart = async (req, res) => {
  const { productId ,quantity, selectedSize } = req.body;
  
  console.log(quantity,"the quantity");
  console.log(productId,"the product id");
  const userId = req.userId;

  try {
    const product = await Product.findById(productId, { productTitle: 1, productPrice: 1 });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const cartItem = {
      product: productId,
      quantity: quantity,
      size: selectedSize
    };
    let userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      userCart = new Cart({ user: userId, cartItems: [] });
    }
    const existingCartItemIndex = userCart.cartItems.findIndex(item => item.product.equals(productId));

    if (existingCartItemIndex !== -1) {
      userCart.cartItems[existingCartItemIndex].quantity += quantity;
    } else {
      userCart.cartItems.push(cartItem);
    }

    await userCart.save();

    console.log("user cart is updated");
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const increData = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart;

    if (quantity <= 0) {
      cart = await Cart.findOneAndUpdate(
        {},
        { $pull: { cartItems: { product: productId } } },
        { new: true }
      );
    } else {
      cart = await Cart.findOneAndUpdate(
        { 'cartItems.product': productId },
        { $set: { 'cartItems.$.quantity': quantity } },
        { new: true }
      );
    }
   
    if (!cart) {
      return res.status(404).json({ message: 'Cart or product not found' });
    }

    // Calculate the total amount
    const totalAmount = cart.cartItems.reduce(
      (total, item) => total + item.product.productPrice * item.quantity,
      0
    );

    res.json({ message: 'Quantity updated successfully', totalAmount });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const checkOut = async(req, res) => {
  const userId = req.userId;
  const userCart = await Cart.findOne({ user: userId }).populate({
    path: "cartItems.product",
    model: "Product"
  });
  if (!userCart) {
    res.render('animation/404');
    return; 
  }
  const cartItems = userCart.cartItems;
 
  console.log(cartItems.productTitle, "the data");
  const user = await User.findOne({ _id: userId }, { addresses: 1 });
  if (user) {
    const add = user.addresses;
    // console.log(add[0].name);
    const couponData =  await Coupon.find({},{});
    res.render('userHome/checkout', { cartItems ,add, user, couponData });
  } else {
    res.render('animation/404');
  }
 
};


// const orderData = async (req, res) => {
//   try {
//     const orderData = req.body.orderData;
//     const userId = req.userId; 
//     const paymentMethod = orderData.paymentMethod;
   
//     const user = await User.findById(userId); 
//     const selectedAddress = user.addresses.find(address => address._id.toString() == orderData.address);

  
//     const userCart = await Cart.findOne({ user: userId }).populate({
//       path: "cartItems.product",
//       model: "Product"
//     });
//     const cartItems = userCart.cartItems.map(item => ({
//       productId: item.product._id, 
//       quantity: item.quantity,
//       price: item.product.productPrice 
//     }));
    

  
//     const order = new Order({
//       user: userId,
//       items: cartItems,
//       shippingAddress: selectedAddress,
//       paymentMethod: orderData.paymentMethod,
//       shippingCharge: orderData.methodAddress,
//       subtotals: orderData.newTotalAmt,
//       totalAmount: orderData.totalAmount,
//     });
//     if (paymentMethod == "COD"){
//     await order.save();

//     for (const item of cartItems) {
//       const product = await Product.findById(item.productId);
//       if (product) {
//         product.stock -= item.quantity;

//         await product.save();
//       }
//     }
//     console.log("this is not razor pay is implemented here")
   
//   }else if (paymentMethod == "Razorpay") {
//     const saveOrder = await order.save();
//     try {
//       await order.save();
//       for (const item of cartItems) {
//         const product = await Product.findById(item.productId);
//         if (product) {
//           product.stock -= item.quantity;
//           await product.save();
//         }
//       }

  
//       const orderAmount = orderData.totalAmount * 100;
//       const options = {
//         amount: orderAmount,
//         currency: 'INR',
//         receipt: "",
//         payment_capture: 1,
//       };
  
//       instance.orders.create(options, function (err, razorpayOrder) {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'An error occurred while creating the Razorpay order' });
//         }
//         saveOrder.razorpayOrderId = razorpayOrder.id; 
        
//            saveOrder.save();
//           console.log(razorpayOrder);
//           res.json(razorpayOrder);
//       });
      
  
//       console.log("Razorpay is implemented here");
  
//     } catch (error) {
//       console.error('Error placing order:', error);
//       return res.status(500).json({ error: 'An error occurred while placing the order' });
//     }
//   }
//   await Cart.deleteOne({ user: userId });
//   } catch (error) {
//     console.error('Error placing order:', error);
//     return res.status(500).json({ error: 'An error occurred while placing the order' });
//   }
// }  

const orderData = async (req, res) => {
  try {
    const orderData = req.body.orderData;
    const userId = req.userId;
    const paymentMethod = orderData.paymentMethod;

    const user = await User.findById(userId);
    const selectedAddress = user.addresses.find(
      (address) => address._id.toString() == orderData.address
    );

    const userCart = await Cart.findOne({ user: userId }).populate({
      path: "cartItems.product",
      model: "Product"
    });
    const cartItems = userCart.cartItems.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
      price: item.product.productPrice,
      size: item.size
    }));

    const order = new Order({
      user: userId,
      items: cartItems,
      shippingAddress: selectedAddress,
      paymentMethod: orderData.paymentMethod,
      shippingCharge: orderData.methodAddress,
      subtotals: orderData.newTotalAmt,
      totalAmount: orderData.totalAmount,
    });

    if (paymentMethod == "COD") {
      await order.save();

      for (const item of cartItems) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock -= item.quantity;
          await product.save();
        }
      }
      console.log("This is not Razorpay, it's implemented here");
    } else if (paymentMethod == "Razorpay") {
      try {
        const saveOrder = await order.save();

        for (const item of cartItems) {
          const product = await Product.findById(item.productId);
          if (product) {
            product.stock -= item.quantity;
            await product.save();
          }
        }

        const orderAmount = orderData.newTotalAmt * 100;

        const options = {
          amount: orderAmount,
          currency: 'INR',
          receipt: 'orderId', // Set your receipt ID here
          payment_capture: 1,
        };

        instance.orders.create(options, function (err, razorpayOrder) {
          if (err) {
            console.error('error on razor payyyyy',err);
            // return res.status(500).json({ error: 'An error occurred while creating the Razorpay order' });
          }else{
            console.log(razorpayOrder , 'razorpay order created');
             saveOrder.razorpayOrderId = razorpayOrder.id;
          
          saveOrder.save().then(() => {
            console.log(razorpayOrder);
           return res.json(razorpayOrder);
          });
          }
         
        });

        console.log("Razorpay is implemented here");
      } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({ error: 'An error occurred while placing the order' });
      }
    }

    await Cart.deleteOne({ user: userId });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ error: 'An error occurred while placing the order' });
  }
};


const animation = async (req , res) => {
  res.render('animation/tick');
}


const emptyCart = async (req , res) => {
  res.render('animation/emptycart');
}


const returnRequest = async (req, res) => {
  const orderId = req.params.orderId;
  console.log(orderId,"orderId: " );
  try {
  
    const orderReturn = new OrderReturn({
      orderId: orderId,
      userId: req.body.userId,
      returnReason: req.body.returnReason,
      
    });
    await orderReturn.save();
    console.log("success");
    res.redirect('/user-Dash');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// const cancelRequest = async (req, res) => {
//   const orderId = req.params.orderId;
//   console.log(orderId ,"the id of the order");
//   try{
//     const cancelOrder = await Order.findById(orderId);
//     cancelOrder.status = "Cancelled";
//     await cancelOrder.save();
   
//   }catch(err){
//     res.status(501);
//     console.log(err);
//   }
// }

const cancelRequest = async (req, res) => {
  const { orderId } = req.body;

  try {
    const cancelOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'Cancelled' },
      { new: true }
    );

    if (!cancelOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const canceledAmount = cancelOrder.totalAmount;
    const userId = cancelOrder.user;

    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId, balance: canceledAmount, transactions: [] });
      wallet.transactions.push({ type: 'deposit', amount: canceledAmount, orderId, timestamp: new Date() });
    } else {
      wallet.balance += canceledAmount;
      wallet.transactions.push({ type: 'deposit', amount: canceledAmount, orderId, timestamp: new Date() });
    }

    const itemsToUpdate = cancelOrder.items;
    const promises = itemsToUpdate.map(async item => {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity; 
        await product.save();
        console.log('Product not found for item:', item.productId);
      }
    });

    await Promise.all([wallet.save(), cancelOrder.save(), ...promises]); 

    res.json({ message: 'Order canceled successfully' });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ message: 'Error canceling order' });
  }
};


const verifyPayment = async (req, res) => {
  
  const { paymentData } = req.body; 
  console.log('Payment data:', paymentData);

      const hmac = crypto.createHmac('sha256', process.env.RAZOR_SECRET);
      console.log(paymentData.response.razorpay_order_id);
      hmac.update(paymentData.response.razorpay_order_id + '|' + paymentData.response.razorpay_payment_id);

      // Creating the hmac in the required format
    const generated_signature = hmac.digest('hex');
  
    if (paymentData.response.razorpay_signature === generated_signature) {
      try {
        const order = await Order.findOne({ razorpayOrderId: paymentData.response.razorpay_order_id });
  
        if (order) {
          order.status = 'Placed';
          await order.save();
  
          console.log('Order status updated to "Placed"');
        } else {
          console.log('Order not found with razorpayOrderId:', paymentData.razorpay_order_id);
        }
       console.log('Order status updated to "Placed"');
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    } else {
      console.log('payment failed');
    }
  
}


const SearchProduct = async (req , res )  => {
  try {
    const inputField = req.params.inputField;
    console.log(inputField);
    const regex = new RegExp(inputField, 'i');
    const Datas = await Product.find({ productTitle: { $regex: regex } });
    console.log(Datas);
    if (Datas.length > 0) {
      res.json({ Datas });
    } else {
        console.log("nothing found");
    }
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: 'An error occurred' });
  }
}


const notfound = async (req , res ) => {
  res.render('animation/notfound');
}


const filterData = async(req, res) => {
  try{
    const receivedData = req.body.selectedValue;
    const Datas = await Product.find({ productCategory: receivedData });
    console.log(Datas);
    if (Datas.length > 0) {
      res.json({ Datas });
    } else {
        console.log("nothing found");
    }
  }catch(err){
  console.log(err);
}
}
  

 const logout = async (req, res) => {
   res.clearCookie('refreshToken');
   res.clearCookie('jwt');

   res.redirect("/signin")
 };


const couponCheck = async (req, res) => {
    try {
      const promoCode = req.params.promoCode; 
      const couponData = await Coupon.findOne({ couponCode: promoCode });
  
      if (!couponData) {
        console.log("Invalid coupon code");
        const err =  'Invalid coupon Code';
      }
      console.log("Coupon data:", couponData);
      return res.json({ couponData });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
};
  



function generateFooter(doc) {
	doc.fontSize(
		10,
	).text(
		'Thank you for Purchasing !!!.',
		50,
		280,
		{ align: 'center', width: 500 },
	);
}


const invoiceDownload = async (req, res) => {
  const { orderId } = req.body;
  console.log("Invoice", orderId);
  try {
    const orderData = await Order.findOne({ _id: orderId });
    if (orderData) {
      const doc = new PDFDocument();

      // Generate the header
     

      try {
        doc.info.Title = 'Invoice';
        doc.info.Author = 'Sneak-Ecom Pvt Ltd';
        doc.fontSize(18).text('Invoice', { align: 'center' });
        doc.fontSize(14).text('Sneak-Ecom Pvt Ltd', { align: 'center' });
        doc.moveDown();

        const currentDate = new Date().toLocaleDateString('en-US');
        doc.fontSize(12).text('Date: ' + currentDate, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Order ID: ${orderData._id}`);
        doc.fontSize(12).text(`Payment Method: ${orderData.paymentMethod}`);
        doc.fontSize(12).text(`Shipping Charge: $${orderData.shippingCharge.toFixed(2)}`);
        doc.fontSize(12).text(`Subtotals: $${orderData.subtotals.toFixed(2)}`);
        doc.fontSize(12).text(`Total Amount: $${orderData.totalAmount.toFixed(2)}`);
        doc.moveDown();

        // Generate the footer
        generateFooter(doc);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="invoice_${orderData._id}.pdf"`);
        doc.pipe(res);
        doc.end();
        console.log('Invoice generated and sent for download.');
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      console.log('Order not found.');
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const contactUS = (req, res) => {
  res.render('userHome/contact');
}



const userImageAdd = async (req, res) => {
  try {
    result = await cloudinary.uploader.upload(req.file.path);

    const userId = req.userId; 
    const user = await User.findById(userId);
    console.log(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.userImage = {
      secure_url: result.secure_url,
      cloudinary_id: result.public_id,
    };
    await user.save();

    res.json({ message: 'User profile image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};


const userDelete = async (req, res) => {
  const addressId = req.params.addressId;
  const userId = req.userId;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const addressIndex = user.addresses.findIndex(address => address._id == addressId);

    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }
    user.addresses.splice(addressIndex, 1);
    await user.save();

   console.log('successfully deleted address');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const showOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Extract product information from the populated items
    const orderWithProductInfo = {
      _id: order._id,
      user: order.user,
      items: order.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        productTitle: item.productId.productTitle, 
        productImage: item.productId.productImages, 
      })),
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      shippingCharge: order.shippingCharge,
      subtotals: order.subtotals,
      totalAmount: order.totalAmount,
      createdOn: order.createdOn,
      status: order.status,
      deliveredOn: order.deliveredOn,
      razorpayOrderId: order.razorpayOrderId,
    };

    res.json(orderWithProductInfo);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const filterProduct = async (req, res) => {
  const selectedValue = req.query.sort;

  let sortQuery = {};

  if (selectedValue === 'low-to-high') {
    sortQuery = { productPrice: 1 };
  } else if (selectedValue === 'high-to-low') {
    sortQuery = { productPrice: -1 };
  }

  try {
    const products = await Product.find().sort(sortQuery);

    res.json({ Datas: products });
  } catch (error) {
    console.error('Error fetching and sorting products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
    userHome,
    productData,
    shopPage,
    productCart,
    userDash,
    updateDash,
    addAddress,
    addSearch,
    editAddress,
    addToCart,
    increData,
    checkOut,
    orderData,
    animation,
    emptyCart,
    returnRequest,
    cancelRequest,
    verifyPayment,
    SearchProduct,
    notfound,
    filterData,
    logout,
    couponCheck,
    invoiceDownload,
    contactUS,
    userImageAdd,
    userDelete,
    showOrder,
    filterProduct
}