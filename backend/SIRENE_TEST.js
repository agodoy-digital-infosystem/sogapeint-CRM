const axios = require('axios');
require('dotenv').config();

const searchCompanyByName = async (companyName) => {
  try {
    const response = await axios.get(`${process.env.SIRENE_API_URL_1}/siret?q=${encodeURIComponent(companyName)}`, {
      headers: { 'Authorization': `Bearer ${process.env.SIRENE_API_PASSWORD}` }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la recherche de l'entreprise:", error);
    return null;
  }
};

// Exemple d'utilisation
searchCompanyByName("A VOS MARQUES").then(data => {
  console.log(data);
});
