const express = require('express');
const userRoutes = require('./routes/user.routes');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
connectDB();
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index.routes');
const uploadRoutes = require('./routes/upload.routes');


const app = express();
app.set('view engine','ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/user', userRoutes);
app.use('/', uploadRoutes);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("index");
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});