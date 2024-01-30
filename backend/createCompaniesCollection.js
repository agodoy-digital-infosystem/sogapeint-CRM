require('dotenv').config();
const mongoose = require('mongoose');
const UserModel = require('./models/User');
const CompanyModel = require('./models/Company');
const OrderFormModel = require('./models/Contract');

// Configuration de la connexion MongoDB
mongoose.connect(process.env.MONGO_URI);

function normalizeCompanyName(name) {
    return name
        .toUpperCase() // Convertir en majuscules
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
        .replace(/\d{4}/g, "") // Supprimer les années
        .trim() // Supprimer les espaces avant et après
        .replace(/\s+/g, ' '); // Remplacer les espaces multiples par un seul espace
}

async function createCompaniesCollection() {
    try {
        const uniqueCompanies = await UserModel.distinct("company");
        let companyMap = {};

        for (let company of uniqueCompanies) {
            const normalized = normalizeCompanyName(company);
            if (normalized) {
                let existingCompany = await CompanyModel.findOne({ normalized_name: normalized });
                const employeeIds = await UserModel.find({ company: company }).select('_id');

                // Trouver les contrats pour les différents rôles
                const contractsAsCustomer = await OrderFormModel.find({ customer: { $in: employeeIds } }).select('_id');
                const contractsAsContact = await OrderFormModel.find({ contact: { $in: employeeIds } }).select('_id');
                const contractsAsExternalContributor = await OrderFormModel.find({ external_contributor: { $in: employeeIds } }).select('_id');

                if (existingCompany) {
                    if (!existingCompany.names.includes(company)) {
                        existingCompany.names.push(company);
                    }
                    existingCompany.employees = [...new Set([...existingCompany.employees, ...employeeIds.map(e => e._id)])];
                    existingCompany.contractsAsCustomer = [...new Set([...existingCompany.contractsAsCustomer, ...contractsAsCustomer.map(c => c._id)])];
                    existingCompany.contractsAsContact = [...new Set([...existingCompany.contractsAsContact, ...contractsAsContact.map(c => c._id)])];
                    existingCompany.contractsAsExternalContributor = [...new Set([...existingCompany.contractsAsExternalContributor, ...contractsAsExternalContributor.map(c => c._id)])];
                    await existingCompany.save();
                } else {
                    companyMap[normalized] = {
                        names: [company],
                        normalized_name: normalized,
                        employees: employeeIds.map(e => e._id),
                        contractsAsCustomer: contractsAsCustomer.map(c => c._id),
                        contractsAsContact: contractsAsContact.map(c => c._id),
                        contractsAsExternalContributor: contractsAsExternalContributor.map(c => c._id)
                    };
                }
            }
        }

        const normalizedCompanies = Object.values(companyMap);
        if (normalizedCompanies.length > 0) {
            await CompanyModel.insertMany(normalizedCompanies);
        }

        const allCompanies = await CompanyModel.find({}).populate('employees').populate('contractsAsCustomer').populate('contractsAsContact').populate('contractsAsExternalContributor');
        console.log(allCompanies);
    } catch (error) {
        console.error("Erreur lors de la création de la collection companies :", error);
    }
}

createCompaniesCollection().then(() => mongoose.disconnect());