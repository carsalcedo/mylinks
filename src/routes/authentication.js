const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn, isNotLogged} = require('../lib/auth')

router.get('/signup', isNotLogged, (req, res) =>{
    res.render('auth/signup')
}); //ruta  para utilizarel formulario

router.post('/signup', isNotLogged, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
})); //ruta para recibir los datos del formulario

router.get('/signin', isNotLogged, (req, res) =>{
    res.render('auth/signin');
});

router.post('/signin', (req, res, next) =>{
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next)
})

router.get('/profile', isLoggedIn, (req, res) =>{
    res.render('profile');
});

router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/signin');
    });
  });

module.exports = router;

