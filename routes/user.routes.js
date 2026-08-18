const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/register', (req, res) => {
  res.render('register');
});  

router.post('/register', 
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register', {
        error: errors.array()[0].msg
      });
    }
    
    const { username, email, password } = req.body;

    const existingUser = await UserModel.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.render('register', {
        title: 'User Registration',
        error: 'User already exists with this username or email.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      username,
      email,
      password: hashedPassword
    });

    res.redirect('/user/login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login',
  body('username').trim().isLength({ min: 3 }),
  body('password').trim().isLength({ min: 5 }),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { 
        error: 'Please enter valid login credentials.'
      });
    }

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.render('login', {
        error: 'Username or password is incorrect.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', {
        error: 'Username or password is incorrect.'
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.redirect('/home');
  }
);

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/user/login');
});

module.exports = router;