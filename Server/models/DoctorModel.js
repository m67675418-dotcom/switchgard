const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    specialty: { type: String, required: true }, // (عام، أخصائي...)
    numOrdre: { type: String, required: true }, // رقم القيد المهني
    location: { type: String }, // للتنقل في الـ Map
    isAvailable: { type: Boolean, default: true } // حالة الحراسة
}, {collection: "doctors"});

module.exports = mongoose.model('Doctor', doctorSchema);