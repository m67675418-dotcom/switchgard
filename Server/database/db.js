// CODE DATA BASE FICHER / db.js
const mongoose = require('mongoose');
require('dotenv').config(); // تحميل الإعدادات من ملف .env

const connectDB = async () => {
    try {
        // نضع الرابط مباشرة هنا للتجربة فقط، حتى نتأكد أن الاتصال يعمل
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;