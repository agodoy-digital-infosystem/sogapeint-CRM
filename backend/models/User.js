const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: {
        type: String,
        required: true,
        validate: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['superAdmin', 'cocontractor', 'subcontractor', 'customer', 'comanager', 'supermanager']
    },
    authorized_connection: { type: Boolean, default: true },
    access_token: { type: String, required: true },
    salt: { type: String, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: false },
    bgcolor: String,
    dateUpd: { type: Date, default: Date.now },
    dateAdd: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
