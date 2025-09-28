const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    name: String,
    googleId: String,
    dob: Date,
});

module.exports = mongoose.model('User', userSchema);
