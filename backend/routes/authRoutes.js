// routes/authRoutes.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAdminOrSuperAdmin } = require('../middlewares/authMiddleware');

console.log('authController', authController);

// Limiter pour la route de connexion
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limite chaque IP à 5 tentatives de connexion
    message: 'Trop de tentatives de connexion depuis cette IP, veuillez réessayer après 15 minutes'
  });

// Route pour l'inscription
// router.post('/signup', authController.signup);

// Route pour ajouter un nouvel utilisateur
router.post('/addUser', isAdminOrSuperAdmin, authController.addUser);

// Route pour obtenir tous les utilisateurs (protégée par le middleware)
router.get('/allUsers', isAdminOrSuperAdmin, authController.getAllUsers);


// Route pour la connexion
router.post('/login',loginLimiter, authController.login);


//// ENTREPRISES 
// Route pour obtenir la liste de toutes les entreprises
router.get('/entreprises', isAdminOrSuperAdmin, authController.getCompanies);
// Route pour rechercher des entreprises
router.get('/entreprises/search', isAdminOrSuperAdmin, authController.searchCompanies);

module.exports = router;
