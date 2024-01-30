const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');
const Document = require('./Document');
const Contract = require('./Contract');

const companySchema = new mongoose.Schema({
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
    ref: 'User' // Référence au modèle User importé
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
  contractsAsCustomer: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Contract' 
  }],
  contractsAsContact: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Contract' 
  }],
  contractsAsExternalContributor: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Contract' 
  }]
});

module.exports = mongoose.model('Company', companySchema);
