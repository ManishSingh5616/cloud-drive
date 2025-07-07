const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const isAuth = require('../middleware/auth');
const User = require('../models/user.model'); 

router.post('/upload', isAuth, upload.single('file'), async (req, res) => {
   try {
    // console.log("User from JWT:", req.user);
    // console.log("File uploaded to Cloudinary:", req.file);

    const user = await User.findById(req.user.userId);
    if (!user) throw new Error("User not found");

    user.uploads.push({ url: req.file.path });
    await user.save();

    res.redirect('/home');
  } catch (error) {
    //console.error("Upload failed:", error);
    res.status(500).send('Upload failed');
  }
});

module.exports = router;
