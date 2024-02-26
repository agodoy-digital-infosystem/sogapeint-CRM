const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CompanyModel = require('../models/Company');
const ContractModel = require('../models/Contract');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../services/emailService');
const crypto = require('crypto');

// // console.log('Importation du authController');

const { isEmail } = require('validator');

exports.login = async (req, res) => {
  try {
    // // console.log('Tentative de connexion');
    const { email, password } = req.body;
    if (!isEmail(email)) {
      return res.status(400).json({ message: 'Adresse email invalide.' });
    }

    // // console.log('Email:', email);

    // Recherche de l'utilisateur avec des conditions supplémentaires (actif et autorisé)
    const user = await User.findOne({ email, active: true, authorized_connection: true });
    // // console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé ou non autorisé.' });
    }

    // // console.log('Vérification du mot de passe');
    const isMatch = await bcrypt.compare(password, user.password);
    // // console.log('Le mot de passe correspond:', isMatch ? 'Oui' : 'Non');

    if (!isMatch) {
      return res.status(401).json({ message: 'Mauvais mot de passe.' });
    }

    // // console.log('Génération du token JWT');
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
  // // console.log('Expiration du token:', expiresIn);

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: expiresIn });

    // // console.log('Connexion réussie, token généré');
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

// réinitialisation du mot de passe par un super admin
exports.resetPasswordFromAdmin = async (req, res) => {
  try {
    // // console.log('Réinitialisation du mot de passe');
    // // console.log('Request :', req);
    // // console.log('Request body:', req.body);
    // // console.log('Request params:', req.params);
    const { userId } = req.body;
    const newPassword = Math.random().toString(36).slice(-10); // Génération d'un mot de passe aléatoire

    // // console.log('User id:', userId);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Capitalise la première lettre du prénom et met le reste en minuscule
    const formatFirstName = updatedUser.firstname.charAt(0).toUpperCase() + updatedUser.firstname.slice(1).toLowerCase();

    // Met le nom de famille en majuscule
    const formatLastName = updatedUser.lastname.toUpperCase();
    // Envoi de l'e-mail avec le nouveau mot de passe
    await sendEmail(updatedUser.email, 'Réinitialisation du mot de passe', {
      password: newPassword,
      CRM_URL: process.env.CRM_URL,
      firstname: formatFirstName,
      lastname: formatLastName
    },
    "passwordResetFromAdminTemplate"
    );

    // // console.log('Mot de passe réinitialisé avec succès');
    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès et e-mail envoyé.' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({ error: error.message });
  }
};


// Fonction pour demander la réinitialisation du mot de passe par un utilisateur
exports.forgotPassword = async (req, res) => {
  // // console.log('Demande de réinitialisation du mot de passe');
  // // console.log('Request :', req);
  // // console.log('Request body:', req.body);
  // // console.log('Request params:', req.params);
  try {
    const { email } = req.body;
    // Vérifier si l'utilisateur existe dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet e-mail." });
    }

    // Générer un code de réinitialisation aléatoire
    const resetCode = crypto.randomBytes(4).toString('hex');
    const resetCodeExpiry = new Date(Date.now() + 3600000); // Code valide pour 1 heure

    // Sauvegarder le code et sa date d'expiration dans la base de données
    await User.findByIdAndUpdate(user._id, { resetCode, resetCodeExpiry });

    // Capitalise la première lettre du prénom et met le reste en minuscule
    const formatFirstName = user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1).toLowerCase();

    // Met le nom de famille en majuscule
    const formatLastName = user.lastname.toUpperCase();

    // Envoyer le code à l'utilisateur par e-mail
    await sendEmail(user.email, 'Code de réinitialisation du mot de passe', {
      resetCode: resetCode,
      firstname: formatFirstName,
      lastname: formatLastName 
    },
    'passwordResetCodeTemplate'
    );

    res.status(200).json({ message: "Un e-mail avec un code de réinitialisation a été envoyé." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour vérifier le code de réinitialisation
exports.verifyResetCode = async (req, res) => {
  // // console.log('Vérification du code de réinitialisation');
  // // console.log('Request :', req);
  // // console.log('Request body:', req.body);
  // // console.log('Request params:', req.params);
  try {
    const { email, code } = req.body;
    // // console.log('Email:', email);
    // // console.log('Code:', code);
    // Vérifier si le code et l'email correspondent et si le code n'a pas expiré
    const user = await User.findOne({
      email,
      resetCode: code,
      resetCodeExpiry: { $gt: Date.now() }
    });

    // const userTest = await User.findOne({
    //   email
    // });
    // // // console.log('User:', userTest);

    if (!user) {
      return res.status(400).json({ message: "Code de réinitialisation invalide ou expiré." });
    }

    res.status(200).json({ message: "Le code de réinitialisation est valide.", userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
  // // console.log('Réinitialisation du mot de passe');
  try {
    const { email, code, newPassword } = req.body;
    // // console.log('email:', email);
    // // console.log('code:', code);
    // // // console.log('New password:', newPassword);

    // Vérifier si le code et l'email correspondent et si le code n'a pas expiré
    const user = await User.findOne({
      email,
      resetCode: code,
      resetCodeExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Code de réinitialisation invalide ou expiré." });
    }

    // Hasher le nouveau mot de passe avant de le sauvegarder
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword, resetCode: null, resetCodeExpiry: null });

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Fonction pour obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    // // console.log('Fetching all users');
    const users = await User.find();
    // // console.log(`Found ${users.length} users`);
    // supprimer le mot de passe de chaque utilisateur
    users.forEach(user => {
      user.password = undefined;
      // supprimer le code de réinitialisation et sa date d'expiration de chaque utilisateur
      user.resetCode = undefined;
      user.resetCodeExpiry = undefined;
      // supprime le sel de chaque utilisateur
      user.salt = undefined;
    })

    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour ajouter un nouvel utilisateur
exports.addUser = async (req, res) => {
  try {
    // // console.log('Adding new user');
    const { email, password, firstname, lastname, phone, company, role, active, authorized_connection } = req.body;
    if (!isEmail(email)) {
      return res.status(400).json({ message: 'Adresse email invalide.' });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Un utilisateur avec cette adresse email existe déjà.' });
    }
    // cherche un utilisateur avec le même nom et prénom (insensible à la casse)
    user = await User.findOne({ firstname: { $regex: new RegExp(`^${firstname}$`, 'i') }, lastname: { $regex: new RegExp(`^${lastname}$`, 'i') } });
    if (user) {
      return res.status(400).json({ message: 'Un utilisateur avec ce nom et prénom existe déjà.' });
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
    // // console.log('New user added');
    res.status(201).json({ message: 'Utilisateur créé avec succès.', userId: newUser._id });
  } catch (error) {
    console.error('Error adding new user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour avoir un utilisateur par son id
exports.getUserById = async (req, res) => {
  try {
    // // console.log('Fetching user by id');
    // // // console.log('Request :', req);
    const { userId } = req.params;
    // // console.log('User id:', userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    // // console.log('Found user:', user);
    // supprimer le mot de passe de la réponse
    user.password = undefined;
    // supprimer le code de réinitialisation et sa date d'expiration de la réponse
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    // supprime le sel de la réponse
    user.salt = undefined;
    res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour modifier un utilisateur
exports.updateUser = async (req, res) => {
  // // console.log('Modification de l’utilisateur');
  // // console.log('Request :', req);
  // // console.log('Request body:', req.body);
  // // console.log('Request params:', req.params);
  try {
    // // console.log('Modification de l’utilisateur');
    const { userId } = req.params;
    const { email, firstname, lastname, phone, company, role, active, authorized_connection } = req.body;
    // // console.log('User id:', userId);
    // Mise à jour de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), {
      email, firstname, lastname, phone, company, role, active, authorized_connection
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // // console.log('Utilisateur modifié avec succès');
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la modification de l’utilisateur:', error);
    res.status(500).json({ error: error.message });
  }
};


// Fonction pour supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    // // console.log('Suppression de l’utilisateur');
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // // console.log('Utilisateur supprimé avec succès');
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l’utilisateur:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour rechercher un utilisateur par nom, prénom ou email (insensible à la casse)
exports.searchUsers = async (req, res) => {
  // console.log('Recherche d\’utilisateurs');
  try {
    // console.log('Recherche d\’utilisateurs');
    // console.log('Request :', req.query);
    const query = req.query.q;
    // Recherche insensible à la casse, selon une partie du prénom, du nom ou de l'email
    const users = await User.find({
      $or: [
        { firstname: { $regex: query, $options: 'i' } },
        { lastname: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    });
    // console.log('Nombre d\’utilisateurs trouvés:', users.length);
    // console.log('Users:', users);
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de la recherche des utilisateurs", error });
  }
};



//// ENTREPRISES TEST


exports.getCompanies = async (req, res) => {
  // // console.log('Récupération des entreprises');
  try {
    const companies = await CompanyModel.find({}).populate('employees').populate('documents').populate('contractsAsCustomer').populate('contractsAsContact').populate('contractsAsExternalContributor');
    // // console.log(`Found ${companies.length} companies`);
    res.json(companies);
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de la récupération des entreprises", error });
    console.error('Erreur lors de la récupération des entreprises:', error);
  }
};

// Fonction pour rechercher des entreprises par nom
exports.searchCompanies = async (req, res) => {
  try {
    const query = req.query.q;
    const companies = await CompanyModel.find({
      $or: [
        { normalized_name: new RegExp(query, 'i') },
        { names: new RegExp(query, 'i') }
      ]
    }).select('normalized_name names -_id');
    res.json(companies);
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de la recherche des entreprises", error });
  }
};

// Fonction pour avoir une entreprise par son id
exports.getCompanyById = async (req, res) => {
  try {
    // // console.log('Fetching company by id');
    // // // console.log('Request :', req);
    const { companyId } = req.params;
    // // console.log('Company id:', companyId);
    const company = await CompanyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Entreprise non trouvée.' });
    }
    // // // console.log('Found company:', company);
    res.status(200).json(company);
  } catch (error) {
    console.error('Error retrieving company:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour modifier une entreprise
exports.updateCompany = async (req, res) => {
  // // console.log('Modification de l’entreprise');
  // // console.log('Request :', req);
  // // console.log('Request body:', req.body);
  // // console.log('Request params:', req.params);
  try {
    // // console.log('Modification de l’entreprise');
    const { companyId } = req.params;
    const { normalized_name, address, city, postalCode, country, phone, email, website, employees, documents, contractsAsCustomer, contractsAsContact, contractsAsExternalContributor } = req.body;
    // // console.log('Company id:', companyId);
    // Mise à jour de l'entreprise
    const updatedCompany = await CompanyModel.findByIdAndUpdate(new mongoose.Types.ObjectId(companyId), {
      normalized_name, address, city, postalCode, country, phone, email, website, employees, documents, contractsAsCustomer, contractsAsContact, contractsAsExternalContributor
    }, { new: true });

    if (!updatedCompany) {
      return res.status(404).json({ message: 'Entreprise non trouvée.' });
    }

    // // console.log('Entreprise modifiée avec succès');
    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error('Erreur lors de la modification de l’entreprise:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour supprimer une entreprise
exports.deleteCompany = async (req, res) => {
  try {
    // // console.log('Suppression de l’entreprise');
    const { companyId } = req.params;

    const deletedCompany = await CompanyModel.findByIdAndDelete(companyId);

    if (!deletedCompany) {
      return res.status(404).json({ message: 'Entreprise non trouvée.' });
    }

    // // console.log('Entreprise supprimée avec succès');
    res.status(200).json({ message: 'Entreprise supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l’entreprise:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour ajouter une entreprise
exports.addCompany = async (req, res) => {
  try {
    // // console.log('Ajout d’une nouvelle entreprise');
    const { normalized_name, address, city, postalCode, country, phone, email, website, employees, documents, contractsAsCustomer, contractsAsContact, contractsAsExternalContributor } = req.body;
    let company = await CompanyModel.findOne({ normalized_name });
    if (company) {
      return res.status(400).json({ message: 'Une entreprise avec ce nom existe déjà.' });
    }
    const newCompany = new CompanyModel({
      normalized_name, address, city, postalCode, country, phone, email, website, employees, documents, contractsAsCustomer, contractsAsContact, contractsAsExternalContributor
    });
    await newCompany.save();
    // // console.log('Nouvelle entreprise ajoutée');
    res.status(201).json({ message: 'Entreprise créée avec succès.', companyId: newCompany._id });
  } catch (error) {
    console.error('Erreur lors de l’ajout d’une nouvelle entreprise:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour obtenir uniquement la liste des noms des entreprises
exports.getCompaniesNames = async (req, res) => {
  try {
    // // console.log('Fetching companies names');
    const companies = await CompanyModel.find().select('name');
    // // console.log(`Found ${companies.length} companies`);
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error retrieving companies names:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour obtenir un contrat par son id
exports.getContractById = async (req, res) => {
  try {
    // // console.log('Fetching contract by id');
    // // console.log('Request :', req);
    const { contractId } = req.params;
    // // console.log('Contract id:', contractId);
    const contract = await ContractModel.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contrat non trouvé.' });
    }
    // // // console.log('Found contract:', contract);
    res.status(200).json(contract);
  } catch (error) {
    console.error('Error retrieving contract:', error);
    res.status(500).json({ error: error.message });
  }
};

/// Contrats

// Fonction pour obtenir la liste de tous les contrats
exports.getContracts = async (req, res) => {
  try {
    // console.log('Récupération de tous les contrats');
    // Récupère tous les contrats, remplace les objectId contenus dans customer, contact, external_contributor et subcontractor par les user complets
    const contracts = await ContractModel.find()
    .populate('customer')
    .populate('contact')
    .populate('external_contributor')
    .populate('subcontractor');

    // supprime les mots de passe et le sel de chaque utilisateur
    contracts.forEach(contract => {
      if (contract.customer){
        if (contract.customer.password){
          contract.customer.password = undefined;
        }
        if (contract.customer.salt){
          contract.customer.salt = undefined;
        }
      }
      if (contract.contact){
        if (contract.contact.password){
          contract.contact.password = undefined;
        }
        if (contract.contact.salt){
          contract.contact.salt = undefined;
        }
      }
      if (contract.external_contributor){
        if (contract.external_contributor.password){
          contract.external_contributor.password = undefined;
        }
        if (contract.external_contributor.salt){
          contract.external_contributor.salt = undefined;
        }
      }
      if (contract.subcontractor){
        if (contract.subcontractor.password){
          contract.subcontractor.password = undefined;
        }
        if (contract.subcontractor.salt){
          contract.subcontractor.salt = undefined;
        }
      }
    });

    // console.log(`Found ${contracts.length} contracts`);
    res.json(contracts);
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de la récupération des contrats", error });
    console.error('Erreur lors de la récupération des contrats:', error);
  }
};

// Fonction pour ajouter un nouveau contrat
exports.addContract = async (req, res) => {
  try {
    // Extraction des champs nécessaires du corps de la requête
    const {
      internal_number, customer, contact, external_contributor, address, appartment_number, quote_number,
      mail_sended, invoice_number, amount_ht, benefit_ht, execution_data_day, execution_data_hour, benefit,
      status, occupied, start_date_works, end_date_works, end_date_customer, trash, date_cde
    } = req.body;
    // console.log('internal_number:', internal_number);
    // Vérification de l'existence préalable du contrat via le numéro interne
    let contract = await ContractModel.findOne({ internal_number });
    if (contract) {
      return res.status(400).json({ message: 'Un contrat avec ce numéro interne existe déjà.'+JSON.stringify(contract) });
    }

    // Création d'un nouveau contrat avec les champs adaptés
    const newContract = new ContractModel({
      internal_number, customer, contact, external_contributor, address, appartment_number, quote_number,
      mail_sended, invoice_number, amount_ht, benefit_ht, execution_data_day, execution_data_hour, benefit,
      status, occupied, start_date_works, end_date_works, end_date_customer, trash, date_cde
    });

    // Enregistrement du nouveau contrat dans la base de données
    await newContract.save();

    // Réponse indiquant la réussite de l'ajout du contrat
    res.status(201).json({ message: 'Contrat créé avec succès.', contractId: newContract._id });
  } catch (error) {
    console.error('Erreur lors de l’ajout d’un nouveau contrat:', error);
    res.status(500).json({ error: error.message });
  }
};
