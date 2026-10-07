
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Hello Express World!");
});

app.listen(3000, () => {
    console.log("A szerver elindult a 3000-es porton.");
});
