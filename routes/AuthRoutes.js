const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

// Regisztráció
router.get("/register", AuthController.registerGet);
router.post("/register", AuthController.registerPost);

// Bejelentkezés
router.get("/login", AuthController.loginGet);
router.post("/login", AuthController.loginPost);

// Kijelentkezés
router.get("/logout", AuthController.logout);

module.exports = router;
