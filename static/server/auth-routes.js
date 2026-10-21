// Authentication and registration routes.
function registerAuthRoutes(app, state) {
    app.get("/", function (req, res) {
        res.redirect(typeof req.cookies.login === "undefined" ? "/login" : "/filemanager");
    });

    app.get("/login", function (req, res) {
        if (typeof req.cookies.login === "undefined") {
            res.render("login.hbs");
        } else {
            res.redirect("/filemanager");
        }
    });

    app.post("/login", function (req, res) {
        for (const user of state.users) {
            if (user.login === req.body.login && user.pass === req.body.pass) {
                res.cookie("login", user.login, { httpOnly: true, maxAge: 60 * 30 * 1000 });
                return res.redirect("/filemanager");
            }
        }
        return res.redirect("/error?reason=invalid_try");
    });

    app.get("/register", function (req, res) {
        if (typeof req.cookies.login === "undefined") {
            res.render("register.hbs");
        } else {
            res.redirect("/filemanager");
        }
    });

    app.post("/register", function (req, res) {
        if (state.logins.includes(req.body.login)) {
            return res.redirect("/error?reason=login_exist");
        }
        if (req.body.login.length < 3) {
            return res.redirect("/error?reason=short_login");
        }
        if (req.body.pass !== req.body.c_pass) {
            return res.redirect("/error?reason=invalid_pass");
        }

        state.logins.push(req.body.login);
        state.users.push({ login: req.body.login, pass: req.body.pass });
        return res.redirect("/login");
    });

    app.get("/error", function (req, res) {
        const errors = {
            short_login: "Za krótki login!!! Minimalna ilość znaków: 3",
            invalid_pass: "Hasła nie pokrywają się!!!",
            login_exist: "Taki użytkownik już istnieje!!! Podaj inną nazwę",
            invalid_try: "Nieprawidłowy login lub hasło!!!"
        };
        res.render("error.hbs", { error: errors[req.query.reason] });
    });
}

module.exports = { registerAuthRoutes };
