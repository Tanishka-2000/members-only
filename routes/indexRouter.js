const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController.js');

router.get('/', auth.getStories);

router.get('/log-in', auth.getLogInForm);

router.post('/log-in', auth.logInUser);

router.get('/sign-in', auth.getSignInForm);

router.post('/sign-in', auth.signInUser);

router.get('/createStory', auth.getCreateStoryForm);

router.post('/createStory', auth.createStory);

router.post('/story/:id/delete', auth.deleteStory);

router.get('/member-log-in', auth.getMemberLogInForm);

router.post('/member-log-in', auth.logInMember);

router.get('/admin-log-in', auth.getAdminLogInForm);

router.post('/admin-log-in', auth.logInAdmin);

module.exports = router;
