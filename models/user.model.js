const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 13,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    uploads: [
      {
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
});

module.exports = mongoose.model('User', userSchema);
