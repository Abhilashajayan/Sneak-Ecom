const nodemailer = require('nodemailer');
const OTPGenerator = require('otp-generator');
const OTP = require('../models/otp');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
require('dotenv').config();

let emails;
const registerMail = async (req, res)=>{
try{
    const { email } = req.body;
   
    const otp = OTPGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, digits: true });
    emails = email;
    const newOTP = new OTP({
      userEmail: email,
      otp: otp,
      expiresAt: new Date(new Date().getTime() + 1 * 60 * 1000),
    });
    newOTP.save();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.EMAIL,
        pass:process.env.PASSWORD,
    },
});

function sendOtp(otp){
    const mailoptions = {
        from:process.env.EMAIL,
        to:email,
        subject: 'OTP Verification',
        text:`Your OTP for signup in sneak is :${otp} this will be valid only for one minute`,
        
    }

   

    transporter.sendMail(mailoptions,(err, info)=>{
        if(err){
            console.error('error sending email', err);
        }else{
            console.log('eamil sent:',info.response);
        }
    });
    
}

sendOtp(otp);
res.redirect('/otp');
    }catch(err){
        console.error('error sending email', err);
    }
    
}
async function removeExpiredOTP() {
    try {
      const now = new Date();
    const data =  await OTP.deleteMany({ expiresAt: { $lte: now } });
      console.log('Expired OTPs removed successfully.');
    } catch (error) {
      console.error('Error removing expired OTPs:', error);
    }
  }
  setInterval(removeExpiredOTP,60 * 1000);



const otpVerify = async (req, res) => {
    async function removeExpiredOTP() {
        try {
          const now = new Date();
        const data =  await OTP.deleteMany({ expiresAt: { $lte: now } });
          console.log('Expired OTPs removed successfully.');
        } catch (error) {
          console.error('Error removing expired OTPs:', error);
        }
      }
      setInterval(removeExpiredOTP,60 * 1000);

      
    const {  otp1 , otp2 ,otp3 , otp4 } = req.body;
    const combinedOTP = otp1 + otp2 + otp3 + otp4;
    
    const combinedOTPInteger = parseInt(combinedOTP);
    console.log(combinedOTPInteger);
    const userData = req.session.userData;
    
    
  
    try {
      
      if(req.session.userData)
      {
      const {username , email, password } = req.session.userData;
      const foundOTP = await OTP.findOne({ otp : combinedOTPInteger });
        console.log(foundOTP);
        console.log(foundOTP.otp);
      if (!foundOTP) {
        res.status(404).json({ error: 'OTP not found for the provided email.' });
      } else if (foundOTP.otp == combinedOTPInteger) {
        const Users = new User({
            username,
            email,
            password,
            status:'false'
          });
          Users.save();
          console.log('added success fully');
        res.status(200);
        req.session.destroy();
        res.redirect('/signin');
      } else {
        res.status(400).json({ error: 'Invalid OTP. Please try again.' });
         }   
        }
        if(!userData) {
          const foundOTP = await OTP.findOne({ otp : combinedOTPInteger });
          console.log(foundOTP.otp)
          
          if(foundOTP.otp == combinedOTPInteger){
            res.redirect('change-password');
          }else{
            res.status(400).json({ error});
          }
          
         }
      
    } catch (error) {
      console.error('Error finding OTP in the database:', error);
      res.status(500).json({ error: 'Unable to verify OTP.' });
    }
  }
  

  const changePass = async (req, res) => {
    try{
      const { pass }= req.body;
      const hashedPassword = await bcrypt.hash(pass, 10);
      const user = await User.findOneAndUpdate({ email : emails }, {$set: { password: hashedPassword }});
      console.log(user);
      res.redirect('/signin');

    } catch (error) {
    console.log('error');
  }
  }

module.exports = {
    registerMail,
    otpVerify,
    changePass
  
};

