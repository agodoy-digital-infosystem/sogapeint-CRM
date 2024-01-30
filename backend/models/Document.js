const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const User = require('./User');

const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    size: Number,
    dateAdded: {
        type: Date,
        default: Date.now
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Référence au modèle User
        required: true
    },
    description: String,
    url: {
        type: String,
        required: true
    },
    tags: [String],
    version: Number,
    accessPermissions: [String]
});

// Création du modèle Document à partir du schéma
// const Document = mongoose.model('Document', documentSchema);

module.exports = mongoose.model('Document', documentSchema);
