require('dotenv').config();
const mongoose = require('mongoose');
const UserModel = require('./models/User');
const CompanyModel = require('./models/Company');
const OrderFormModel = require('./models/Contract');

// Configuration de la connexion MongoDB
mongoose.connect(process.env.MONGO_URI);

// Fonction pour normaliser le nom de l'entreprise
function normalizeCompanyName(name) {
    // La normalisation se fait déjà dans le champ 'normalized_name', donc on retourne simplement le nom
    return name;
  }
  
  // Fonction pour générer l'abréviation
  function generateAbbreviation(normalizedName) {
    let consonants = normalizedName
                      .toUpperCase()
                      .replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/g, '');
    return consonants.substr(0, 5);
  }
  
  // Fonction pour mettre à jour les abréviations des entreprises
  async function updateCompaniesWithAbbreviations() {
    try {
      // Récupérer toutes les entreprises
      const companies = await CompanyModel.find({});
  
      for (const company of companies) {
        // Utiliser 'normalized_name' pour l'abréviation
        const abbreviation = generateAbbreviation(company.normalized_name);
        // Mettre à jour l'entreprise avec la nouvelle abréviation
        await CompanyModel.updateOne(
          { _id: company._id },
          { $set: { abbreviation: abbreviation } }
        );
      }
  
      console.log('All companies have been updated with abbreviations.');
    } catch (error) {
      console.error('Error updating companies:', error);
    }
  }
  
  // Exécuter la mise à jour et se déconnecter ensuite
  updateCompaniesWithAbbreviations().then(() => mongoose.disconnect());