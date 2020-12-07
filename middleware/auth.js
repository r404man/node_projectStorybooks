module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.redirect('/');
        }
    },
    ensureGuest: function(req, res, next) {
        if(req.isAuthenticated()) {
            console.log(req.user);
            res.redirect('/dashboard');
        }
        else {
            return next();
        }
    }
}