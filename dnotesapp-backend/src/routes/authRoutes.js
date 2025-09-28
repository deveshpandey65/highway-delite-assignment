
const express = require('express');
const { SignUprequestOTP, SignUpverifyOTP, LoginrequestOTP, LoginverifyOTP,GoogleLogin,userVerify } = require('../controllers/authController');
const router = express.Router();

router.post('/signup/otp', SignUprequestOTP );
router.post('/signup/verify', SignUpverifyOTP);

router.post('/login/otp', LoginrequestOTP);
router.post('/login/verify', LoginverifyOTP);

router.post('/user/verify',userVerify)
router.post('/google',GoogleLogin)

module.exports = router;
