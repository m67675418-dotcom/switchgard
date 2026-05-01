require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/User')
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ Account Routes (Auth)
app.use('/api/account/login', require('./routes/accountRoutes/Login'));
app.use('/api/account/register', require('./routes/accountRoutes/Register'));
app.use('/api/account/profile', require('./routes/accountRoutes/getProfile'));

// ✅ Doctor Routes
app.use('/api/doctor/add', require('./routes/DoctorRoutes/addDoctor'));
app.use('/api/doctor/getAll', require('./routes/DoctorRoutes/getDoctors'));
app.use('/api/doctor', require('./routes/DoctorRoutes/GetSingleDoctor'));
app.use('/api/doctor', require('./routes/DoctorRoutes/deleteDoctor'));
app.use('/api/doctor', require('./routes/DoctorRoutes/updateDoctor'));
// ✅ Nurse Routes
app.use('/api/nurse/add', require('./routes/nurseRoutes/addNurse'));
app.use('/api/nurse/getAll', require('./routes/nurseRoutes/getnurse'));
app.use('/api/nurse', require('./routes/nurseRoutes/GetSingleNurse'));
app.use('/api/nurse', require('./routes/nurseRoutes/updateNurse'));
app.use('/api/nurse', require('./routes/nurseRoutes/deleteNurse'));
// ✅ Pharmacist Routes
app.use('/api/pharmacist/add', require('./routes/pharmacistRoutes/addpharmacist'));
app.use('/api/pharmacist/getAll', require('./routes/pharmacistRoutes/getpharmacist'));
app.use('/api/pharmacist', require('./routes/pharmacistRoutes/GetSinglePharmacist'));
app.use('/api/pharmacist', require('./routes/pharmacistRoutes/updatePharmacist'));
app.use('/api/pharmacist', require('./routes/pharmacistRoutes/deletepharmacist'));

// ✅ FireFighter Routes
app.use('/api/firefighter/add', require('./routes/FireFightersRoutes/addFireFighters'));
app.use('/api/firefighter/getAll', require('./routes/FireFightersRoutes/getFireFighter'));
app.use('/api/firefighter', require('./routes/FireFightersRoutes/GetSingleFireFighter'));
app.use('/api/firefighter', require('./routes/FireFightersRoutes/updateFireFighter'));
app.use('/api/firefighter', require('./routes/FireFightersRoutes/deleteFireFighters'));

// ✅ Garde Routes
app.use('/api/garde/add', require('./routes/gardeRoutes/addgarde'));
app.use('/api/garde/getAll', require('./routes/gardeRoutes/getgarde'));
app.use('/api/garde', require('./routes/gardeRoutes/GetSingleGarde'));
app.use('/api/garde', require('./routes/gardeRoutes/updateGarde'));
app.use('/api/garde', require('./routes/gardeRoutes/deleteGarde'));

// ✅ Message Routes
app.use('/api/message/add', require('./routes/messageRoutes/addmessage'));
app.use('/api/message/getAll', require('./routes/messageRoutes/getmessage'));
app.use('/api/message/conversation', require('./routes/messageRoutes/GetConversation'));
app.use('/api/message', require('./routes/messageRoutes/GetSingleMessage'));
app.use('/api/message', require('./routes/messageRoutes/updateMessage'));
app.use('/api/message', require('./routes/messageRoutes/deletemessage'));


// ✅ Transaction Routes
app.use('/api/transaction/add', require('./routes/TransactionRoutes/addtransaction'));
app.use('/api/transaction/getAll', require('./routes/TransactionRoutes/gettransaction'));
app.use('/api/transaction', require('./routes/TransactionRoutes/GetSingleTransaction'));
app.use('/api/transaction', require('./routes/TransactionRoutes/updateTransaction'));
app.use('/api/transaction', require('./routes/TransactionRoutes/deletetransaction'));

// ✅ Email Routes
app.use('/api/email/send', require('./routes/emailHandlers/emailMain'));
app.use('/api/email', require('./routes/emailHandlers/GetSingleEmail'));
app.use('/api/email', require('./routes/emailHandlers/DeleteEmail'));
app.use('/api/email', require('./routes/emailHandlers/UpdateEmail'));
// ✅ Admin Protected Routes
const { protect, authorize } = require('./middleware/authMiddleware');
app.get('/api/admin/dashboard', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: '🛡️ Admin Dashboard', adminId: req.user.id });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;