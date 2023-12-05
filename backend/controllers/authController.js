const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

console.log('Importation du authController');

exports.login = async (req, res) => {
  try {
    console.log('Tentative de connexion');
    const { email, password } = req.body;
    console.log('Email:', email);

    // Recherche de l'utilisateur avec des conditions supplémentaires (actif et autorisé)
    const user = await User.findOne({ email, active: true, authorized_connection: true });
    console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé ou non autorisé.' });
    }

    console.log('Vérification du mot de passe');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Le mot de passe correspond:', isMatch ? 'Oui' : 'Non');

    if (!isMatch) {
      return res.status(401).json({ message: 'Mauvais mot de passe.' });
    }

    console.log('Génération du token JWT');
    const tokenPayload = { 
      userId: user._id, 
      role: user.role, 
      email: user.email 
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Connexion réussie, token généré');
    res.status(200).json({
      userId: user._id,
      token,
      role: user.role
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error.message);
    res.status(500).json({ error: error.message });
  }
};
