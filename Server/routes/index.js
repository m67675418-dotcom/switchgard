const express = require('express');
const router = express.Router();

// Doctor Routes
router.use('/Doctors', require('../routes/DoctorRoutes/addDoctor'));
router.use('/Doctor/getAll', require('../routes/DoctorRoutes/getDoctors'));
router.use('/DeleteDoctor', require('../routes/DoctorRoutes/deleteDoctor'));
router.use('/updateDoctor', require('../routes/DoctorRoutes/updateDoctor'));
router.use('/doctor/:id', require('../routes/DoctorRoutes/GetSingleDoctor'));

// Nurse Routes
router.use('/nurse/add', require('../routes/nurseRoutes/addNurse'));
router.use('/Nurse/getAll', require('../routes/nurseRoutes/getnurse'));
router.use('/deleteNurse', require('../routes/nurseRoutes/deleteNurse'));
router.use('/updateNurse', require('../routes/nurseRoutes/updateNurse'));
router.use('/nurse/:id', require('../routes/nurseRoutes/GetSingleNurse'));

// FireFighter Routes
router.use('/FireFighter', require('../routes/FireFightersRoutes/addFireFighters'));
router.use('/FireFighter/getAll', require('../routes/FireFightersRoutes/getFireFighter'));
router.use('/deletefirefighter', require('../routes/FireFightersRoutes/deleteFireFighters'));
router.use('/updateFireFighter', require('../routes/FireFightersRoutes/updateFireFighter'));
router.use('/FireFighter/:id', require('../routes/FireFightersRoutes/GetSingleFireFighter'));

// Garde Routes
router.use('/garde/add', require('../routes/gardeRoutes/addgarde'));
router.use('/garde/getAll', require('../routes/gardeRoutes/getgarde'));
router.use('/deletegarde', require('../routes/gardeRoutes/deletegarde'));
router.use('/updateGarde', require('../routes/gardeRoutes/updateGarde'));
router.use('/garde/single/:id', require('../routes/gardeRoutes/GetSingleGarde'));

// Pharmacist Routes
router.use('/pharmacist', require('../routes/pharmacistRoutes/addpharmacist'));
router.use('/pharmacist/getAll', require('../routes/pharmacistRoutes/getpharmacist'));
router.use('/deletepharmacist', require('../routes/pharmacistRoutes/deletepharmacist'));
router.use('/updatePharmacist', require('../routes/pharmacistRoutes/updatePharmacist'));
router.use('/pharmacist/:id', require('../routes/pharmacistRoutes/GetSinglePharmacist'));

// Message Routes
router.use('/message', require('../routes/messageRoutes/addmessage'));
router.use('/message/getAll', require('../routes/messageRoutes/getmessage'));
router.use('/deletemessage', require('../routes/messageRoutes/deletemessage'));
router.use('/updateMessage', require('../routes/messageRoutes/updateMessage'));
router.use('/message/:id', require('../routes/messageRoutes/GetSingleMessage'));
router.use('/message', require('../routes/messageRoutes/GetConversation'));

// Transaction Routes
router.use('/Transaction', require('../routes/TransactionRoutes/addtransaction'));
router.use('/transaction/getAll', require('../routes/TransactionRoutes/gettransaction'));
router.use('/deletetransaction', require('../routes/TransactionRoutes/deletetransaction'));
router.use('/updateTransaction', require('../routes/TransactionRoutes/updateTransaction'));
router.use('/transaction/:id', require('../routes/TransactionRoutes/GetSingleTransaction'));

// Email Routes
router.use('/email/send', require('../routes/emailHandlers/emailMain'));
router.use('/email/:id', require('../routes/emailHandlers/GetSingleEmail'));
router.use('/email/:id', require('../routes/emailHandlers/DeleteEmail'));
router.use('/email/:id', require('../routes/emailHandlers/UpdateEmail'));

// Account Routes
router.use('/account/login', require('../routes/accountRoutes/Login'));
router.use('/account/register', require('../routes/accountRoutes/Register'));
router.use('/account/profile', require('../routes/accountRoutes/getProfile'));

module.exports = router;