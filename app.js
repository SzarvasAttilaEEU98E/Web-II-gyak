require("dotenv").config();

const connectDB = require("./config/db");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const AuthRoutes = require("./routes/AuthRoutes");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.SESSION_MONGO_URI,
        collectionName: "sessions"
    })
}));

app.use("/", AuthRoutes);

app.get("/", (req, res) => {
    res.send("Mozi nyilvántartó");
});

const PORT = process.env.PORT || 3000;
const startServer = async () => {
    await connectDB();
    
    app.listen(PORT, () => {
        console.log(`A szerver elindult a ${PORT}-es porton.`);
    });
};

startServer();
