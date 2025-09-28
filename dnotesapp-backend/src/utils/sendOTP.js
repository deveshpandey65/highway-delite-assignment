
const nodemailer = require('nodemailer');

module.exports.sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP Verification',
        html: `<h3>Your OTP is: ${otp}</h3>`,
    });
};
