
const User = require('../../src/models/User');
const OTP = require('../../src/models/OTP');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/sendOTP');

exports.SignUprequestOTP = async (req, res) => {
    const body = JSON.parse(req.body || "{}");
    const { email } = body;
    let user = await User.findOne({ email });
    if (user) {
        return  res.status(400).json ({ message: 'User already exists' });
        
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp, expiresAt: new Date(Date.now() + 10 * 60000) });
    await sendOTP(email, otp);
    res.json({ message: 'OTP sent to email' });
};


exports.SignUpverifyOTP = async (req, res) => {
    const body = JSON.parse(req.body || "{}");
    const { email, otp, name, dob } = body;

    try {
        const record = await OTP.findOne({ email, otp });

        if (!record || record.expiresAt < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // ✅ Create new user with name and dob
        user = await User.create({ email, name, dob });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // ✅ Clean up used OTP
        await OTP.deleteMany({ email });

        // ✅ Send response
        res.json({
            message: 'Signup successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                dob: user.dob,
            },
        });
    } catch (err) {
        console.error('OTP verification failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.LoginrequestOTP = async (req, res) => {
    console.log('sending...')
    const body = JSON.parse(req.body || "{}");
    const { email } = body;
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User does not exists' });

    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp, expiresAt: new Date(Date.now() + 10 * 60000) });
    await sendOTP(email, otp);
    res.json({ message: 'OTP sent to email' });
};


exports.LoginverifyOTP = async (req, res) => {
    const body = JSON.parse(req.body || "{}");
    const { email, otp } = body;

    try {
        // 1. Validate OTP
        const record = await OTP.findOne({ email, otp });

        if (!record || record.expiresAt < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // 2. Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        // 3. Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 4. Clean up used OTP
        await OTP.deleteMany({ email });

        // 5. Send response
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                dob: user.dob,
            },
        });
    } catch (err) {
        console.error('OTP verification failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Google Login
exports.GoogleLogin = async (req, res) => {
  const { id_token } = req.body || {};
  if (!id_token) return res.status(400).json({ error: "No token provided" });

  try {
    const ticket = await client.verifyIdToken({ idToken: id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email, name, googleId });

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid Google token" });
  }
};

exports.userVerify = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("name email");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};