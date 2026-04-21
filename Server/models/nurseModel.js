// models/Nurse.js
const mongoose = require('mongoose');

const NurseSchema = new mongoose.Schema({ 
    userId: { type: String, required: true },
    diplome: { type: String, enum: ['IDE', 'ISP'], required: true },
    service: { type: String }, // قسم (استعجالات، أطفال، إلخ)
    equipe: { type: String } // رمز الفريق (A, B, C...)
}, {
    collection: "nurses"
});

module.exports = mongoose.model('Nurse', NurseSchema);