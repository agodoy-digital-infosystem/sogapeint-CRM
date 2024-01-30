// routes/authRoutes.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAdminOrSuperAdmin, isConnected } = require('../middlewares/authMiddleware');

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
router.get('/allUsers', isConnected, authController.getAllUsers); // TODO: vérifier droits d'accès à cette route

// Route pour obtenir un utilisateur (protégée par le middleware)
router.get('/user/:userId', isConnected, authController.getUserById);

// Route pour modifier un utilisateur (protégée par le middleware isAdminOrSuperAdmin)
router.put('/user/:userId', isAdminOrSuperAdmin, authController.updateUser);

// Route pour supprimer un utilisateur (protégée par le middleware isAdminOrSuperAdmin)
router.delete('/user/:userId', isAdminOrSuperAdmin, authController.deleteUser);

// Route pour la connexion
router.post('/login',loginLimiter, authController.login);

// Route pour la réinitialisation du mot de passe par un administrateur
router.post('/resetPasswordFromAdmin', isAdminOrSuperAdmin, authController.resetPasswordFromAdmin);

// Route pour demander la réinitialisation du mot de passe par un utilisateur
router.post('/forgotPassword', authController.forgotPassword);

// Route pour vérifier le code de réinitialisation
router.post('/verifyResetCode', authController.verifyResetCode);

// Route pour réinitialiser le mot de passe
router.post('/resetPassword', authController.resetPassword);


//// ENTREPRISES 
// Route pour obtenir la liste de toutes les entreprises
router.get('/entreprises', isAdminOrSuperAdmin, authController.getCompanies);
// Route pour rechercher des entreprises
router.get('/entreprises/search', isAdminOrSuperAdmin, authController.searchCompanies);

// Route pour scraper l'adresse et l'activité d'une entreprise
router.get('/entreprises/scrape', isAdminOrSuperAdmin, authController.scrapeCompany);

// Route pour scraper l'adresse et l'activité d'une entreprise par région
router.get('/entreprises/scrapeByRegion', isAdminOrSuperAdmin, authController.scrapeCompanyByRegion);

module.exports = router;
