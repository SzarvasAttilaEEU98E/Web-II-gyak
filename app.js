require("dotenv").config();

const connectDB = require("./config/db");
const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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
