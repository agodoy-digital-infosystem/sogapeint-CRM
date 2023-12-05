// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.log('authController', authController);

// Route pour l'inscription
// router.post('/signup', authController.signup);

// Route pour la connexion
router.post('/login', authController.login);

module.exports = router;
