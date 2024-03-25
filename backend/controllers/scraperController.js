// scraperController.js
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const regions = {
    'Île-de-France': ['75', '77', '78', '91', '92', '93', '94', '95'],
    'Auvergne-Rhône-Alpes': ['01', '03', '07', '15', '26', '38', '42', '43', '63', '69', '73', '74'],
    'Bourgogne-Franche-Comté': ['21', '25', '39', '58', '70', '71', '89', '90'],
    'Bretagne': ['22', '29', '35', '56'],
    'Centre-Val de Loire': ['18', '28', '36', '37', '41', '45'],
    'Corse': ['2A', '2B'],
    'Grand Est': ['08', '10', '51', '52', '54', '55', '57', '67', '68', '88'],
    'Hauts-de-France': ['02', '59', '60', '62', '80'],
    'Normandie': ['14', '27', '50', '61', '76'],
    'Nouvelle-Aquitaine': ['16', '17', '19', '23', '24', '33', '40', '47', '64', '79', '86', '87'],
    'Occitanie': ['09', '11', '12', '30', '31', '32', '34', '46', '48', '65', '66', '81', '82'],
    'Pays de la Loire': ['44', '49', '53', '72', '85'],
    'Provence-Alpes-Côte d\'Azur': ['04', '05', '06', '13', '83', '84'],
    'Guadeloupe': ['971'],
    'Martinique': ['972'],
    'Guyane': ['973'],
    'La Réunion': ['974'],
    'Mayotte': ['976'],
};


async function scrapeData(companyName) {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        const url = `https://annuaire-entreprises.data.gouv.fr/rechercher?terme=${encodeURIComponent(companyName)}`;
        
        await page.goto(url, { waitUntil: 'networkidle2' });
        const data = await page.content();
        
        const $ = cheerio.load(data);
        let results = [];
        
        $('.results-list .result-item').each((i, element) => {
            const title = $(element).find('.title span').text().trim();
            const activity = $(element).find('div:nth-of-type(2)').text().trim();
            const mainAddress = $(element).find('.adress').first().text().trim();
            const additionalAddresses = $(element).find('ul.matching-etablissement li').map((i, el) => {
                return $(el).text().trim(); // Récupérer le texte de chaque élément <li>
            }).get(); // Transformer en tableau
            const siren = $(element).find('.result-link').attr('data-siren');
            
            // Vérifier et enlever la dernière entrée si elle contient "en activité"
            if (additionalAddresses.length > 0 && additionalAddresses[additionalAddresses.length - 1].includes('en activité')) {
                additionalAddresses.pop();
            }
            
            results.push({
                title,
                activity,
                addresses: [mainAddress, ...additionalAddresses], // Stocker toutes les adresses dans un tableau
                siren
            });
        });
        
        await browser.close();
        return results;
    } catch (error) {
        console.error("Error scraping data:", error);
        return [];
    }
}


function filterByRegion(results, regionName) {
    const regionPostalCodes = regions[regionName];
    if (!regionPostalCodes) {
        console.error('Région non trouvée');
        return [];
    }
    
    return results.filter(result => {
        // Vérifie chaque adresse pour un match de code postal
        return result.addresses.some(address => {
            const postalCodeMatch = address.match(/\b\d{5}\b/);
            if (!postalCodeMatch) return false;
            const postalCode = postalCodeMatch[0].substring(0, 2);
            return regionPostalCodes.includes(postalCode);
        });
    });
}


// Cette fonction est appelée par la première route pour obtenir une liste d'entreprises
async function getCompanyList(req, res) {
  // const { companyName, region } = req.params;
  // vérifie si la région est présente dans la requête, sinon la région est Occitanie par défaut
  const companyName = req.params.companyName;
  const region = req.query.region || 'Occitanie';
  console.log("companyName", companyName, "region", region);
  try {
    const results = await scrapeData(companyName);
    const filteredResults = filterByRegion(results, region);
    // const filteredResults = results;
    console.log("filteredResults", filteredResults);
    res.json(filteredResults);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des entreprises." });
  }
}

// Cette fonction est appelée par la deuxième route après que l'utilisateur ait sélectionné une entreprise
async function getCompanyDetailsFromApi(name, postalCode) {
    const query = encodeURIComponent(name);
    console.log("name", name, "postalCode", postalCode);
    if (!name || !postalCode) {
      console.error("Nom de l'entreprise ou code postal manquant pour la requête API");
      return null;
    }
    const url = `https://recherche-entreprises.api.gouv.fr/search?q=${query}&categorie_entreprise=PME,ETI&code_postal=${postalCode}&minimal=true&include=siege,complements&page=1&per_page=10`;
    console.log(`Fetching company details from API: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data) // log pour le débogage
        return data.results;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Fonction pour enrichir les données d'une entreprise spécifique
// async function getEnrichedCompanyData(name, postalCode) {
//   console.log("Enriching company data for:", name, postalCode);
//     try {
//       const apiResults = await getCompanyDetailsFromApi(name, postalCode);
//       if (apiResults && apiResults.length > 0) {
//         return apiResults[0];
//       } 
//       // else {
        
//       //   // throw new Error('Aucune donnée enrichie trouvée pour cette entreprise.');
//       //   return null;
//       // }
//     } catch (error) {
//       // throw error;
//       console.error(`Erreur lors de l'appel à l'API externe: ${error.message}`);
//       return null;
//     }
//   }
async function getEnrichedCompanyData(req, res) {
  const { companyName, postalCode } = req.params;
  console.log("Enriching company data for:", companyName, postalCode);
    try {
      const apiResults = await getCompanyDetailsFromApi(companyName, postalCode);
      if (apiResults && apiResults.length > 0) {
        // Essayer de récupérer le CA de l'entreprise
        const ca = await getCA(companyName, apiResults[0].siren);
        if (ca && ca.length > 0) {
          apiResults[0].ca = ca;
        }
        res.json(apiResults[0]); // Envoie le premier résultat enrichi
      } else {
        res.status(404).json({ message: "Aucune donnée enrichie trouvée pour cette entreprise." });
      }
    } catch (error) {
      console.error(`Erreur lors de l'appel à l'API externe: ${error.message}`);
      res.status(500).json({ message: `Erreur lors de l'appel à l'API externe: ${error.message}` });
    }
}

async function getCA(company, siren) {
  let url = "https://www.verif.com/societe/";
  companyName = String(company).replace(/ /g, "-").toUpperCase();
  url += companyName + "-" + siren + "/";
  // scraping de la page pour récupérer le CA (élément contenant les classes css MuiTypography-root MuiTypography-bodyDefaultMedium css-1yf1lih et dont le texte se termine par "€")
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const data = await page.content();
    const $ = cheerio.load(data);
    let ca = $(".MuiTypography-root.MuiTypography-bodyDefaultMedium.css-1yf1lih").filter(function() {
      return $(this).text().trim().endsWith("€");
    }).text().trim();
    await browser.close();
    return ca;
  } catch (error) {
    console.error("Erreur lors de la récupération du CA:", error);
    return null;
  }
}


module.exports = {
  getCompanyList,
  getEnrichedCompanyData,
};



module.exports = {
  getCompanyList,
  getEnrichedCompanyData,
};
