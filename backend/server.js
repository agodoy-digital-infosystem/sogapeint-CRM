const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importation des routes
const authRoutes = require('./routes/authRoutes');
const scraperRoutes = require('./routes/scraperRoutes');

// Initialisation d'Express
const app = express();

// Configuration des middlewares
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Utilisation des routes
app.use('/api/auth', authRoutes);
// app.use('/api', companyRoutes);
app.use('/api/scrape', scraperRoutes)

// Middleware pour la gestion des erreurs
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Une erreur est survenue sur le serveur", error: err });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
