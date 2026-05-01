const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  specialty: { type: String, required: true },
  numOrdre: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  role: { type: String, default: 'doctor' }
}, { timestamps: true });

// ✅ الصحيح: async بلا next
doctorSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.error('❌ Error hashing password:', error);
    throw error;
  }
});

doctorSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);