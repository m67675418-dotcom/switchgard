// models/Firefighter.js
const mongoose = require('mongoose');

const FireFighterSchema = new mongoose.Schema({
    userId: { type: String },
    matricule: { type: String, required: true }, // الرقم العسكري
    grade: { type: String },
    uniteIntervention: { type: String } 

}, {collection:"FireFighter"}   );

module.exports = mongoose.model('FireFighter', FireFighterSchema);