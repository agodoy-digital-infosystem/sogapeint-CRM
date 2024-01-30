// routes.js
const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');

// Route pour obtenir une liste d'entreprises correspondant à un nom
router.get('/company-list/:companyName', scraperController.getCompanyList);

// Route pour obtenir des données enrichies pour une entreprise sélectionnée
router.get('/enriched-company/:companyName/:postalCode', scraperController.getEnrichedCompanyData);

// Exporter le routeur pour l'utiliser dans votre application principale
module.exports = router;
