const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    authorized_connection: {
        type: Boolean,
        required: true,
        default: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    company: {
        type: String,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    role: {
        type: String,
        required: true,
        enum: [
            'superAdmin', 
            'cocontractor', 
            'subcontractor', 
            'comanager', 
            'supermanager', 
            'customer'
    ]  
    },
    password: {
        type: String,
        required: true
    },
    dateUpd: {
        type: Date,
        default: Date.now
    },
    dateAdd: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
