// Ellenőrzi, hogy a felhasználó be van-e jelentkezve
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    }

    return res.redirect("/login");
};

// Ellenőrzi, hogy a felhasználó adminisztrátor-e
exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === "admin") {
        return next();
    }

    return res.redirect("/");
};
