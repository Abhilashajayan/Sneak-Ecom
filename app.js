const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectToMongoDB = require('./config/database');
const session = require('express-session');
const cors = require('cors');
const flash = require('express-flash');
const userRouter = require('./routes/userSign');
const adminRouter = require('./routes/adminDash');
connectToMongoDB();

 const app = express();

 app.use(
    session({
      secret: 'your-secret-key', 
      resave: false,
      saveUninitialized: true,
    })
  );
  const corsOptions = {
    origin: '', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
    optionsSuccessStatus: 204, 
  }
  app.use(cors(corsOptions));

app.set('views', path.join(__dirname, 'views'));
const ejs = require('ejs');
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use('/', userRouter);
app.use('/', adminRouter);




module.exports = app;
