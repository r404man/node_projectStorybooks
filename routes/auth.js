const express = require('express');
const passport = require('passport');
const router = express.Router();


// @desk Auth with Google
// @rout GET /
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


// @desk Google auth callback 
// @rout GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failWithError: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
)

// @desk Logout user 
// @rout /auth/logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

module.exports = router;