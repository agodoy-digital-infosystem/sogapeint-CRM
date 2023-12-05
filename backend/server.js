const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importation des routes
const authRoutes = require('./routes/authRoutes'); // Assurez-vous que le chemin est correct

// Initialisation d'Express
const app = express();

// Configuration des middlewares
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Utilisation des routes
app.use('/api/auth', authRoutes);

// Middleware pour la gestion des erreurs
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Une erreur est survenue sur le serveur", error: err });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
