const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Assurez-vous que le modèle Document est correctement importé
const Document = require('./document.model'); // Ajustez le chemin selon l'emplacement réel

const companySchema = new Schema({
  names: {
    type: [String],
    required: true
  },
  normalized_name: {
    type: String,
    required: true,
    unique: true
  },
  address: String,
  employees: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' // Assurez-vous que le modèle User est défini quelque part
  }],
  industry: [String],
  websites: [String],
  phone: [String],
  email: [String],
  additionalFields: Schema.Types.Mixed, // Pour des champs supplémentaires de types variés
  documents: [{
    type: Schema.Types.ObjectId,
    ref: 'Document' // Référence au modèle Document
  }],
  contracts: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Contract' // Assurez-vous que le modèle Contract est défini
  }]
});

// Création du modèle Company à partir du schéma
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
