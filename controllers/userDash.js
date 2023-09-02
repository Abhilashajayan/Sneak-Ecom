const Product = require('../models/productSchema');
const User = require('../models/userSchema');
const Cart = require('../models/cartSchema');
const Order = require('../models/orderSchema');
const OrderReturn = require('../models/returnSchema');
const Wallet = require('../models/walletSchema');
const Razorpay = require('razorpay');
const crypto = require('crypto');


const instance = new Razorpay({
  key_id: 'rzp_test_yo3IwIuNagxMzt',
  key_secret: 'OeuoUOM1gfBUaG4MCtAx4aHv',
});

const userHome = async (req, res)=>{
    try{
        const userData = await Product.find({}, {} );
        const cartItems = await Cart({},{});
        console.log(cartItems.length)
        res.render('userHome/userHome',{ userData , cartItems });
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
      console.log(cartItems.length)
      res.render('userHome/addToCart',{products , cartItems});
      if (!products) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


const shopPage = async (req, res) => {
  try{
  const userData = await Product.find({}, {} );
  res.render('userHome/shopeList',{ userData });
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
    const userCart = await Cart.findOne({ user: userId }).populate({
      path: "cartItems.product",
      model: "Product"
    });
    if (!userCart) {  
      res.redirect('/empty-Cart');
    }
    const cartItems = userCart.cartItems;
    console.log(cartItems,"cartItems");
    res.render('userHome/productCart', { cartItems });
  } catch (err) {
    console.error(err);
    
  }
};


const userDash = async (req, res) => {
  try{
    
    const userId = req.userId;
    const walletData = await Wallet.findOne({ userId: userId });
    const userData = await User.findById(userId);
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
  const { productId ,quantity } = req.body;
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
  const cartItems = userCart.cartItems;

  const user = await User.findOne({ _id: userId }, { addresses: 1 });
  if (user) {
    const add = user.addresses;
   
    // console.log(add[0].name);
    res.render('userHome/checkout', { cartItems ,add, user });
  } else {
    console.log('User not found');
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
      price: item.product.productPrice
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

        const orderAmount = orderData.totalAmount * 100;

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

      const hmac = crypto.createHmac('sha256', 'OeuoUOM1gfBUaG4MCtAx4aHv');
      console.log(paymentData.response.razorpay_order_id);
      hmac.update(paymentData.response.razorpay_order_id + '|' + paymentData.response.razorpay_payment_id);

      // Creating the hmac in the required format
    const generated_signature = hmac.digest('hex');
  
    if (paymentData.response.razorpay_signature === generated_signature) {
      try {
        const order = await Order.findOne({ razorpayOrderId: paymentData.razorpay_order_id });
  
        if (order) {
          // order.status = 'Placed';
          // await order.save();
  
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
    verifyPayment
    
}