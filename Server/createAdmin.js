require('dotenv').config();
const mongoose = require('mongoose');
const Account = require('./models/accountModel');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Account.findOne({ email: 'admin@switchguard.com' });
    if (existing) {
      console.log('⚠️ Admin already exists:', existing.email, '| role:', existing.role, '| isActive:', existing.isActive);
      process.exit(0);
    }

    const admin = new Account({
      email: 'admin@switchguard.com',
      password: 'admin123', // غادي يتشفر أوتوماتيكيًا بـ pre('save') hook
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin created successfully:', admin.email);
    process.exit(0);

  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();