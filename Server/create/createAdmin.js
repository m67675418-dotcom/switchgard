const mongoose = require('mongoose');
const Account = require('../models/accountModel');

const createAdmin = async () => {
  try {
    // ✅ اتصال صحيح
    await mongoose.connect('mongodb://127.0.0.1:27017/User');
    console.log('✅ Connected to MongoDB');

    // حذف Admin قديم
    await Account.deleteOne({ email: 'admin@switchguard.com' });
    console.log('🗑️ Old admin deleted');

    // إنشاء Admin جديد
    const admin = new Account({
      email: 'admin@switchguard.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log('🔑 Login credentials:');
    console.log('   Email: admin@switchguard.com');
    console.log('   Password: admin123');
    console.log('   Role: admin');

    mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    mongoose.connection.close();
  }
};

createAdmin();