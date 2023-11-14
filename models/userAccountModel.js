// UserAccountModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserAccountSchema = new mongoose.Schema({
    userHandle: String,
    userPassword: {
        type: String,
        required: true,
    },
    userRole: {
        type: String,
        enum: ['Alumni', 'Manager'],
        required: true,
    },
});

// Hash the password before saving
UserAccountSchema.pre('save', async function (next) {
    const user = this;

    // Check if password is modified or new user
    if (user.isModified('userPassword') || user.isNew) {
        try {
            // Hash password with bcrypt
            const hashedPassword = await bcrypt.hash(user.userPassword, 10);
            user.userPassword = hashedPassword; // Set hashed password to userPassword field
            next(); // Call next middleware function
        } catch (error) {
            return next(error); // If error, call next middleware function with error
        }
    } else {
        return next(); // If no changes, call next middleware function
    }
});

const UserAccount = mongoose.model('UserAccount', UserAccountSchema);

module.exports = UserAccount;

