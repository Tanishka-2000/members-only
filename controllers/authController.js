const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const Message = require('../models/message.js');
const {body, validationResult} = require('express-validator');

const multer  = require('multer');
const upload = multer({ dest: './public/data/uploads/'});
const fs = require('fs');

// ----------passport set up-----------
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({username: username}, function(err, user) {
            if(err) return done(err);
            if(!user) return done(null, false, {message: 'No such user exist!'});
            bcrypt.compare(password, user.password, function(err, res){
                if(res) return done(null, user);
                return done(null, false, {message: 'Incorrect Password!'});
            });
        });
    }
));

passport.serializeUser(function(user, done){
    return done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

// -----------routes-----------
exports.getStories = (req, res) => {
    Message.find()
    .populate('user')
    .exec(function(err, messages){
        if(err) return next(err);
        res.render('index', {messages});
    });
};

exports.getLogInForm = (req, res) => {
    // console.log(req.session.messages);
    res.render('log-in', {errors: req.session.messages});
};

exports.logInUser = passport.authenticate('local', {
    failureRedirect: '/log-in',
    successRedirect: '/createStory',
    failureMessage: true
    },
);

exports.logOutUser = (req, res, next) => {
    if(!req.user) res.redirect('/');
    else{
        req.logout(function(err){
            if(err) return next(err);
            res.redirect('/')
        });
    }
};

exports.getSignInForm = (req, res) => {
    res.render('sign-in', {user: null, errors: null});
};

exports.signInUser = [
    body('firstName')
    .trim()
    .isLength({ min: 1})
    .withMessage('First Name must be specified')
    .escape()
    .isAlphanumeric()
    .withMessage('First Name contains non-alphanumeric characters'),
    body('lastName')
    .trim()
    .isLength({ min: 1})
    .withMessage('Last Name must be specified')
    .escape()
    .isAlphanumeric()
    .withMessage('Last Name contains non-alphanumeric characters'),
    body('username')
    .trim()
    .isLength({ min: 1})
    .withMessage('E-mail Name must be specified')
    .isEmail()
    .withMessage('Not a valid E-mail')
    .normalizeEmail()
    .custom(value => {
        return User.findOne({username: value}).then(user => {
            if(user) return Promise.reject('E-mail already in use');
        })
    }),
    body('password')
    .isLength({ min: 5 }),
    body('confirmPassword')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
      }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('sign-in', {errors: errors.array(), user: req.body})
            return;
        }
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                password: hashedPassword,
                isMember: false,
                isAdmin: false
            });
            user.save(user, (err) => {
                if(err) next(err);
                res.render('log-in',{errors:null} );
            });
        });
    }
];

exports.getCreateStoryForm = (req, res) => {
    // console.log(req.user);
    if(req.user) res.render('compose');
    else res.redirect('/log-in');
};

exports.createStory = [
    upload.single('image'),
    (req, res) => {
        const message = new Message({
            title: req.body.title,
            msg: req.body.msg,
            img: req.file ? req.file.filename : '',
            timestamp: new Date(),
            user: req.user.id
        });
        message.save(err => {
            if(err) return next(err);
            res.redirect('/');
        });
    }
];

exports.deleteStory = (req, res) => {
    if(!req.user.isAdmin) res.redirect('/');
    else{
        Message.findById(req.params.id, (err, message) => {
            if(err) return next(err);
            if(message === null){
                // No results.
                const err = new Error("Message not found");
                err.status = 404;
                return next(err);
            }
            fs.unlink('./public/data/uploads/'+ message.img, () => {
                console.log('image deleted');
            });
            Message.findByIdAndRemove(req.params.id, err => {
                if(err) return next(err);
                res.redirect('/');
            });
        });
    }
};

exports.getMemberLogInForm = (req, res) => {
    if(!req.user) return res.redirect('/log-in');
    res.render('member-log-in');
};

exports.logInMember = (req, res) => {

    if(!req.user) res.redirect('/log-in');

    if(req.body.memberCode === process.env.MEMBER_CODE){
        let user = new User({
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            username: req.user.username,
            isMember: true,
            isAdmin: req.user.isAdmin,
            _id: req.user._id
        });
        User.findByIdAndUpdate(req.user._id, user, {}, (err, user) => {
            res.redirect('/');
        });
    }else{
        res.redirect('/member-log-in');
    }
};

exports.getAdminLogInForm = (req, res) => {
    if(!req.user) return res.redirect('/log-in');
    res.render('admin-log-in');
};

exports.logInAdmin = (req, res) => {
    if(!req.user) res.redirect('/log-in');

    console.log({your: req.body.adminCode, real: process.env.ADMIN_CODE});
    if(req.body.adminCode === process.env.ADMIN_CODE){
        let user = new User({
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            username: req.user.username,
            isMember: req.user.isMember,
            isAdmin: true,
            _id: req.user._id
        });
        User.findByIdAndUpdate(req.user._id, user, {}, (err, user) => {
            res.redirect('/');
        });
    }else {
        res.redirect('/admin-log-in');
    }
};
