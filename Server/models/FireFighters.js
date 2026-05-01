// 📁 Server/models/FireFighters.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const FireFighterSchema = new mongoose.Schema({
    userId: { type: String },
    gmail: { type: String, required: true, lowercase: true },
    matricule: { type: String, required: true },
    password: { type: String, required: false, select: false },
    grade: { type: String },
    uniteIntervention: { type: String } 
}, {
    collection: "FireFighter",
    timestamps: true
});

// ✅ الصحيح: async بلا next
FireFighterSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error('❌ Error hashing password:', error);
        throw error;
    }
});

FireFighterSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error('❌ Error comparing passwords:', error);
        return false;
    }
};

// ✅ حماية ضد OverwriteModelError (هذا هو المهم!)
module.exports = mongoose.models.FireFighter || mongoose.model('FireFighter', FireFighterSchema);