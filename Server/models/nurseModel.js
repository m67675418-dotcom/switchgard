// 📁 Server/models/nurseModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const NurseSchema = new mongoose.Schema({ 
    userId: { type: String, required: true },
    password: { type: String, required: true, select: false },
    gmail: { type: String, required: true, lowercase: true },
    diplome: { type: String, enum: ['IDE', 'ISP'], required: true },
    service: { type: String },
    equipe: { type: String }
}, {
    collection: "nurses",
    timestamps: true
});

// ✅ الصحيح: async بلا next
NurseSchema.pre('save', async function() {
    // إلا ما تبدلاتش كلمة السر، خرجي
    if (!this.isModified('password')) {
        return;
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // ✅ ما تستدعيش next() مع async!
    } catch (error) {
        console.error('❌ Error hashing password:', error);
        throw error; // ✅ رمي الخطأ باش Mongoose يعرف
    }
});

// ✅ دالة لمقارنة كلمة السر
NurseSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error('❌ Error comparing passwords:', error);
        return false;
    }
};

// ✅ حماية ضد OverwriteModelError
module.exports = mongoose.models.Nurse || mongoose.model('Nurse', NurseSchema);