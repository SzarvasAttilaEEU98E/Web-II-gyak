const User = require("../models/User");
const bcrypt = require("bcryptjs");

//Regisztrációs oldal megjelenítése
exports.registerGet = (req, res) => {
    res.render("register");
};

//Registráció feldolgozása
exports.registerPost = async (req, res) => {
    try {
            const {username, password} = req.body;

            //Ellenőrizzük, hogy minden  mező kivan e töltve
            if(!username || !password) {
                req.session.message = "Minden mezőt ki kell tölteni!";
                return res.redirect("/register");
            }

            //Megnézzük, hogy létezik e már a felhasználó
            const existingUser = await User.findOne({username});
            if(existingUser) {
                req.session.message = "Ez a felhasználó már létezik!";
                return res.redirect("/register");
            }

            //Jelszó hashelése
            const hash = await bcrypt.hash(password, 10);

            await User.create({
                username: username,
                password: hash,
                role: 'user' 
            });

            req.session.message = "Sikeres regisztráció! Most már be tudsz jelentkezni";
            return res.redirect("/login"); 
        }   catch (error)  {
            console.error("Regisztrációs hiba", error);
            return res.status(500).send('Hiba történt a regisztráció során');
            }
};

// Bejelentkezési oldal megjelenítése
exports.loginGet = (req, res) => {
    res.render('login');
};


//Bejelentkezés feldolgozása
exports.loginPost = async (req, res) => {
    try {
        const { username, password} = req.body

        if (!username || !password)
        {
            req.session.message = " Minden kitöltése kötelező";
            return res.redirect("/login");
        }

        //Felhasználó keresése az adatbázisban
        const user = await User.findOne( { username });

        if (!user)
        {
            req.session.message = "Sikertelen bejelentkezés!";
            return res.redirect("/login");
        }

        //jelszó ellenőrzés
        const ok  = await bcrypt.compare(password, user.password);

        if (!ok) {
            req.session.message = "Sikertelen bejelentkezés!";
            return res.redirect("/login");
        }

        //Session megújítása bejelentkezéskor

        req.session.regenerate((error) => {
            if (error) {
                console.error("Session hiba", error);
                return res.status(500).send("Hiba történt a bejelentkezéskor");
            }
            // A bejelentkezett felhasználó adatinak tárolása
            req.session.user = {
                id: user._id.toString(),
                username: user.username,
                role: user.role
            };
            //Jogosultság szerinti átírányítás
            const destination = user.role === "admin" ? "/admin" : "/user";

            req.session.save((error) => {
                if (error) {
                    console.error("Session mentési hiba:", error);
                    return res.status(500).send("Hiba történt a bejelentkezés során")
                }

                return res.redirect(destination);
            });
        });
    } catch (error) {
        console.error("Bejelentkezéskor hiba: ", error);
        return res.status(500).send("Hiba a bejelentkezés során");
    }
};

//Kijelentkezés
exports.logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Kijelentkezés hiba: ", error);
            return res.status(500).send("Hiba történt a kiejelentkezés során");
        }

        res.clearCookie("connect.sid");
        return res.redirect("/");
    });
};