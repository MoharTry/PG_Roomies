const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to PG Roomies');
            res.redirect('/pgroomies');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

const {checkReturnTo} = require('../middleware');

router.post('/login', 
    passport.authenticate('local', { 
    failureFlash: true, 
    failureRedirect: '/login',
    keepSessionInfo: true,
    }), (req, res) => {
    req.flash('success', 'Welcome back!!');
    const redirectUrl = req.session.returnTo || '/pgroomies';
    res.redirect(redirectUrl);
});

router.get('/logout', function (req, res,next) {
        req.logout(function (err) {
            if (err) { return next(err); }
            req.flash('success', "Goodbye!");
            res.redirect('/pgroomies');
        });
    });


module.exports = router;