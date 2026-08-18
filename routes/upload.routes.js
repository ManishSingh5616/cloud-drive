const express = require('express');
const router = express.Router();
const upload = require('../config/s3'); // Import the S3 multer instance
const isAuth = require('../middleware/auth');
const User = require('../models/user.model'); 

router.post('/upload', isAuth, upload.single('file'), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) throw new Error("User not found");

    // multer-s3 stores the public S3 URL in req.file.location
    user.uploads.push({ url: req.file.location });
    await user.save();

    res.redirect('/home');
  } catch (error) {
    // console.error("Upload failed:", error);
    res.status(500).send('Upload failed');
  }
});

module.exports = router;