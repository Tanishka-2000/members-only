require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const indexRouter = require('./routes/indexRouter.js');

mongoose.set('strictQuery', true);
const dev_db_url = process.env.MONGODBURL;
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connection error'));


const app = express();

// setting view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

// parse form data to js object
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// setting pasport midleware
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
// handle routing
app.use('/', indexRouter);


// creating page not found error
app.use(function(req, res, next) {
    const error = new Error('page not found!');
    error.status = 404;
    next(error);
});

// rendering error page
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.status = err.status;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('app listening on port ' + PORT));
