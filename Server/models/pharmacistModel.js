// models/Pharmacist.js
const mongoose = require('mongoose');

const PharmacistSchema = new mongoose.Schema({
    userId: { type: String, ref: 'Pharmacist' },
    nomPharmacie: { type: String, required: true },
    adressePharmacie: { type: String, required: true },
    numAgrement: { type: String, required: true }, // رقم الاعتماد
    isNightShift: { type: Boolean, default: false } // هل هي صيدلية مناوبة ليلاً
},{ collation: "Pharmacist"}  
);

module.exports = mongoose.model('Pharmacist', PharmacistSchema);