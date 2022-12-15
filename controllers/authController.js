const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const {body, validationResult} = require('express-validator');

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

exports.getLogInForm = (req, res) => {
    res.render('log-in')
};

exports.logInUser = passport.authenticate('local', {
    successRedirect: '/createStory',
    failureRedirect: '/log-in',
    failureMessage: true
});

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
            console.log(errors.array());
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
                res.render('log-in');
            });
        });
    }    
];

exports.getCreateStoryForm = (req, res) => {
    res.render('compose');

};

exports.createStory = (req, res) => {

};

exports.getMemberLogInForm = (req, res) => {
    res.render('member-log-in');

};

exports.logInMember = (req, res) => {

};

exports.getAdminLogInForm = (req, res) => {
    res.render('admin-log-in');

};

exports.logInAdmin = (req, res) => {

};
