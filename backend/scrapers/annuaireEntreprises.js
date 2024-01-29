const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

function splitMultipleAddresses(address) {
    // Étape 1: Séparer les adresses multiples
    // Cette regex tente de trouver des séquences de caractères qui ressemblent à des codes postaux suivis de noms de ville
    const addressSplitRegex = /(\d{5}\s?[A-ZÉÈÀÛÔÏa-zéèàûôï\s-]+)(?=\d{5}|$)/g;
    const separateAddresses = address.split(addressSplitRegex).filter(Boolean);

    // Étape 2: Définir une fonction pour extraire les informations de l'adresse
    function extractAddressInfo(singleAddress) {
        const postalCodeRegex = /(\d{5})/;
        const cityRegex = /([A-ZÉÈÀÛÔÏ][a-zéèàûôï\s-]+)$/;
        const streetRegex = /([\w\s]+),/;
        const postalCodeMatch = singleAddress.match(postalCodeRegex);
        const cityMatch = singleAddress.match(cityRegex);
        const streetMatch = singleAddress.match(streetRegex);

        return {
            street: streetMatch ? streetMatch[1].trim() : '',
            postalCode: postalCodeMatch ? postalCodeMatch[1].trim() : '',
            city: cityMatch ? cityMatch[1].trim() : '',
            fullAddress: singleAddress.trim() // On garde l'adresse complète pour référence
        };
    }

    // Étape 3: Normaliser les données
    return separateAddresses.map(extractAddressInfo);
}

async function scrapeData(companyName) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const url = `https://annuaire-entreprises.data.gouv.fr/rechercher?terme=${encodeURIComponent(companyName)}`;
        
        await page.goto(url, { waitUntil: 'networkidle2' });
        const data = await page.content();

        const $ = cheerio.load(data);
        let results = [];

        $('.results-list .result-item').each((i, element) => {
            const title = $(element).find('.title span').text().trim();
            const activity = $(element).find('div:nth-of-type(2)').text().trim();
            const address = $(element).find('.adress').text().trim();
            splittedAdresses = splitMultipleAddresses(address);
            const siren = $(element).find('.result-link').attr('data-siren');
            split = JSON.stringify(splittedAdresses);

            results.push({
                title,
                activity,
                address,
                split,
                siren
            });
        });

        await browser.close();
        console.log(results)
        return results;
    } catch (error) {
        console.error("Error scraping data:", error);
        return [];
    }
}

// Utilisation de la fonction
scrapeData("a vos marques").then(results => console.log(results));
