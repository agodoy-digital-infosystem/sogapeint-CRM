const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

console.log('Importation du authController');

const { isEmail } = require('validator');

exports.login = async (req, res) => {
  try {
    console.log('Tentative de connexion');
    const { email, password } = req.body;
    if (!isEmail(email)) {
      return res.status(400).json({ message: 'Adresse email invalide.' });
    }

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
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      phone: user.phone,
      company: user.company
    };
    // const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Vérifie si l'utilisateur a coché "Se souvenir de moi"
  const expiresIn = req.body.rememberMe ? '7d' : '1h'; // 7 jours si "Se souvenir de moi" est coché, sinon 1 heure

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: expiresIn });

    console.log('Connexion réussie, token généré');
    res.status(200).json({
      userId: user._id,
      token,
      role: user.role,
      firstName: user.firstname,
      lastName: user.lastname,
      phone: user.phone,
      company: user.company
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error.message);
    res.status(500).json({ error: error.message });
  }
};



// Fonction pour obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    console.log('Fetching all users');
    const users = await User.find();
    console.log(`Found ${users.length} users`);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour ajouter un nouvel utilisateur
exports.addUser = async (req, res) => {
  try {
    console.log('Adding new user');
    const { email, password, firstname, lastname, phone, company, role, active, authorized_connection } = req.body;
    if (!isEmail(email)) {
      return res.status(400).json({ message: 'Adresse email invalide.' });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Un utilisateur avec cette adresse email existe déjà.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      phone,
      company,
      role,
      active,
      authorized_connection,
    });
    await newUser.save();
    console.log('New user added');
    res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (error) {
    console.error('Error adding new user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour avoir un utilisateur par son id
exports.getUserById = async (req, res) => {
  try {
    console.log('Fetching user by id');
    // console.log('Request :', req);
    const { userId } = req.params;
    console.log('User id:', userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    console.log('Found user:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour modifier un utilisateur
exports.updateUser = async (req, res) => {
  console.log('Modification de l’utilisateur');
  console.log('Request :', req);
  console.log('Request body:', req.body);
  console.log('Request params:', req.params);
  try {
    console.log('Modification de l’utilisateur');
    const { userId } = req.params;
    const { email, firstname, lastname, phone, company, role, active, authorized_connection } = req.body;
    console.log('User id:', userId);
    // Mise à jour de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), {
      email, firstname, lastname, phone, company, role, active, authorized_connection
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    console.log('Utilisateur modifié avec succès');
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la modification de l’utilisateur:', error);
    res.status(500).json({ error: error.message });
  }
};


// Fonction pour supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    console.log('Suppression de l’utilisateur');
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    console.log('Utilisateur supprimé avec succès');
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l’utilisateur:', error);
    res.status(500).json({ error: error.message });
  }
};



//// ENTREPRISES TEST
exports.getCompanies = async (req, res) => {
  try {
    const companies = await User.distinct("company"); // Ceci va chercher toutes les valeurs distinctes pour le champ 'company'
    res.json(companies);
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de la récupération des entreprises", error });
  }
};

exports.searchCompanies = async (req, res) => {
  try {
    const query = req.query.q;
    const companies = await User.find({ 
      company: new RegExp(query, 'i') 
    }).distinct("company");
    res.json(companies);
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de la recherche des entreprises", error });
  }
};