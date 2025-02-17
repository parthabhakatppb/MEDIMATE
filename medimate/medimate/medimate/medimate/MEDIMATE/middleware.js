module.exports.isLoggedIn = (req, res, next) => {
    try {
        // console.log(req.user);

        if (!req.isAuthenticated()) { 
            // req.session.redirectUrl = req.originalUrl;
            // req.flash("error", "you must be logged in");
            return res.redirect("/authentication/login");
        }
        next();
    }
    catch (err) {
        next(err);
    }
}