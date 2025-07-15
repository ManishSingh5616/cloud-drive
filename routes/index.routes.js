const express = require('express');
const isAuth = require('../middleware/auth');
const User = require('../models/user.model');


const router = express.Router();
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
  res.redirect('/index');
});


router.get('/home', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.render('home', { user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).send('Server Error');
  }
});

router.get('/mygallery', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.render('mygallery', { user });
  } catch (err) {
    console.error('Failed to fetch user uploads:', err);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;