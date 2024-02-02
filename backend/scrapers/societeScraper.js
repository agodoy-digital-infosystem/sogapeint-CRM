
/// NE FONCTIONNE PAS AVEC LE SITE DE SOCIETE.COM
const axios = require('axios');
const cheerio = require('cheerio');
const { decode } = require('html-entities');

async function searchCompanies(name, department) {
    try {
        // Construire l'URL de recherche avec ou sans département
        const url = `https://www.societe.com/cgi-bin/liste?nom=${encodeURIComponent(name)}${department ? `&dirig=&pre=&ape=&dep=${department}` : ''}`;
        console.log(url);
        const response = await axios.get(url);
        // console.log(response.data);
        
        // Charger le HTML dans Cheerio
        const $ = cheerio.load(response.data);
        // console.log($('.ResultBloc__link__content').text());
        
        const companyDetails = $('.ResultBloc__link__content').map((i, el) => {
            // console.log($(el).html());
            // console.log("prout");
            // Utilisez decode pour convertir les entités HTML
            const name = decode($(el).find('.deno').text().trim());
            const activity = decode($(el).find('p.txt').first().text().trim());
            const siren = decode($(el).find('p.txt').eq(1).text().replace('SIREN', '').trim());
            const address = decode($(el).find('p.txt').last().text().trim());
          
            return { name, activity, siren, address };
          }).get();
          
          console.log(companyDetails);
        
        // Sélectionner les éléments du résultat et les extraire
        // const companies = [];
        // $('.ResultBloc_link_content').each((index, element) => {
        //     console.log("element : "+element);
        //     const company = {
        //         name: $(element).find('.nom').text().trim(),
        //         siren: $(element).find('.siren').text().trim(),
        //         address: $(element).find('.adresse').text().trim(),
        //         // Ajoutez d'autres informations si nécessaire
        //     };
        //     companies.push(company);
        // });
        
        // return companies;
    } catch (error) {
        console.error('Erreur lors du scraping:', error);
    }
}

// Utilisation de la fonction
searchCompanies('A VOS MARQUES', '31') // Avec département
.then(companies => {
    // console.log(companies);
});

// searchCompanies('A VOS MARQUES', '') // Sans département
// .then(companies => {
//     // console.log(companies);
// });
