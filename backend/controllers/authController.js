// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 


// Pas besoin de la route de signup
// exports.signup = async (req, res) => {
//   try {
//     const { firstname, lastname, email, password, role } = req.body;

//     // Hacher le mot de passe
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Créer un nouvel utilisateur
//     const user = new User({
//       firstname,
//       lastname,
//       email,
//       password: hashedPassword,
//       role
//     });

//     // Sauvegarder l'utilisateur dans la base de données
//     await user.save();

//     res.status(201).json({ message: 'Utilisateur créé !' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentification échouée.' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentification échouée.' });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      userId: user._id,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
