const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PharmacistSchema = new mongoose.Schema({
    userId: { type: String },
    gmail: { type: String, required: true, lowercase: true },
    password: { type: String, required: true, select: false },
    nomPharmacie: { type: String, required: true },
    adressePharmacie: { type: String, required: true },
    numAgrement: { type: String, required: true },
    isNightShift: { type: Boolean, default: false }
}, { 
    collection: "pharmacists",
    timestamps: true
});

// ✅ الصحيح: async بلا next
PharmacistSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error('❌ Error hashing password:', error);
        throw error;
    }
});

PharmacistSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error('❌ Error comparing passwords:', error);
        return false;
    }
};

module.exports = mongoose.models.Pharmacist || mongoose.model('Pharmacist', PharmacistSchema);