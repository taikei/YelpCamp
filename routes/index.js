const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');




// ROOT ROUTE - landing.ejs

router.get('/', function(req, res){
    
    res.render('landing');
});





// AUTHENTICATION ROUTES



// ================ SIGN UP ===============

// show register form 
router.get('/register', function(req, res){
    res.render('register', {page: 'register'});
});

// handling signup logic
router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
           
            //req.flash('error', err.message);
            return res.render('register', {'error': err.message});
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to YelpCamp - ' + user.username);
            res.redirect('/campgrounds');
        })
    })
})

//=========== LOGIN =============


// show login form 
router.get('/login', (req, res) => {
    res.render('login', {page: 'login'});
}) 


// hadling login logic

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {
    
});

//=========== LOGOUT =============

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!')
    res.redirect('/campgrounds');
});




module.exports = router;