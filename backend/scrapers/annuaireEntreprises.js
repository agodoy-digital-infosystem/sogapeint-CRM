const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


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
            // const address = $(element).find('.adress').text().trim();
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
                // address,
                addresses: [mainAddress, ...additionalAddresses], // Stocker toutes les adresses dans un tableau
                siren
            });
        });
        
        await browser.close();
        // console.log(results)
        // console.log(JSON.stringify(results, null, 2)); // Afficher les résultats avec un formatage lisible
        return results;
    } catch (error) {
        console.error("Error scraping data:", error);
        return [];
    }
}

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


function filterByRegion(results, regionName) {
    const regionPostalCodes = regions[regionName];
    if (!regionPostalCodes) {
        console.error('Région non trouvée');
        return [];
    }
    
    return results.filter(result => {
        // Vérifiez chaque adresse pour un match de code postal
        return result.addresses.some(address => {
            const postalCodeMatch = address.match(/\b\d{5}\b/);
            if (!postalCodeMatch) return false;
            const postalCode = postalCodeMatch[0].substring(0, 2);
            return regionPostalCodes.includes(postalCode);
        });
    });
}

async function getCompanyDetailsFromApi(name, postalCode) {
    const query = encodeURIComponent(name);
    const url = `https://recherche-entreprises.api.gouv.fr/search?q=${query}&categorie_entreprise=PME,ETI&code_postal=${postalCode}&minimal=true&include=siege,complements&page=1&per_page=10`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function enrichWithApiData(filteredResults) {
    const enrichedResults = [];
    for (const result of filteredResults) {
      const companyName = result.title;
      const postalCodeMatch = result.addresses[0].match(/\b\d{5}\b/);
      if (postalCodeMatch) {
        const postalCode = postalCodeMatch[0];
        const apiResults = await getCompanyDetailsFromApi(companyName, postalCode);
        if (apiResults && apiResults.length > 0) {
          // Ajouter les données de l'API au résultat
          enrichedResults.push({ ...result, ...apiResults[0] });
        } else {
          // Garder le résultat original si aucune donnée de l'API n'est trouvée
          enrichedResults.push(result);
        }
      } else {
        enrichedResults.push(result); // Si aucun code postal n'est trouvé, on garde le résultat original
      }
    }
    return enrichedResults;
  }



// Utilisation de la fonction
// scrapeData("a vos marques").then(results => console.log(results));
// resultats = scrapeData("a vos marques").then(
//     results => filterByRegion(results, 'Occitanie')
//     );
async function main() {
    const results = await scrapeData("digital info system");
    const filteredResults = filterByRegion(results, 'Occitanie');
    const enrichedResults = await enrichWithApiData(filteredResults);
    console.log(JSON.stringify(enrichedResults, null, 2));
  }
  
  main();
