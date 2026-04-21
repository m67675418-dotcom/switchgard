require('dotenv').config();
const cors = require('cors');
const express = require('express');


const app = express();

const addDoctor = require('./routes/DoctorRoutes/addDoctor');
const getDoctors = require('./routes/DoctorRoutes/getDoctors');
const DeleteDoctor = require('./routes/DoctorRoutes/deleteDoctor');
const updateDoctor = require('./routes/DoctorRoutes/updateDoctor');

const addNurse = require('./routes/nurseRoutes/addNurse');
const getNurse = require('./routes/nurseRoutes/getnurse');
const deleteNurse = require('./routes/nurseRoutes/deleteNurse');
const updateNurse = require('./routes/nurseRoutes/updateNurse');

const AddFireFighter = require('./routes/FireFightersRoutes/addFireFighters');
const getFireFighter = require('./routes/FireFightersRoutes/getFireFighter');
const deletefirefighter = require('./routes/FireFightersRoutes/deleteFireFighters');
const updateFireFighter = require('./routes/FireFightersRoutes/updateFireFighter');

const addmessage = require('./routes/messageRoutes/addmessage');
const getmessage = require('./routes/messageRoutes/getmessage');
const deletemessage = require('./routes/messageRoutes/deletemessage');
const updateMessage = require('./routes/messageRoutes/updateMessage');

const addgarde = require('./routes/gardeRoutes/addgarde');
const getgarde = require('./routes/gardeRoutes/getgarde');
const deletegarde = require('./routes/gardeRoutes/deletegarde');
const updateGarde = require('./routes/gardeRoutes/updateGarde');

const addpharmacist = require('./routes/pharmacistRoutes/addpharmacist');
const getpharmacist = require('./routes/pharmacistRoutes/getpharmacist');
const deletepharmacist = require('./routes/pharmacistRoutes/deletepharmacist');
const updatePharmacist = require('./routes/pharmacistRoutes/updatePharmacist');

const addtransaction = require('./routes/TransactionRoutes.js/addtransaction');
const gettransaction = require('./routes/TransactionRoutes.js/gettransaction');
const deletetransaction = require('./routes/TransactionRoutes.js/deletetransaction');
const updateTransaction = require('./routes/TransactionRoutes.js/updateTransaction');

const authRoutes = require('./routes/sendmessage/authRoutes');
const sendEmailRoutes = require('./routes/sendmessage/sendEmail');

const createAccount = require('./routes/accountRoutes/createAccount');


//SconnectDB();  

// 2. Middleware ضروري جداً لقراءة البيانات من Postman
app.use(express.json());
app.use(cors());
// 3. رابط الاختبار (للتأكد أن السيرفر شغال)
app.get("/test", (req, res) => {
    res.json({ message: "Server is working perfectly!" });
});

// 4. ربط مسارات الأطباء (هنا السر!)
 app.use('/api/Doctors',addDoctor);
 app.use('/api/Doctor/getAll', getDoctors);
 app.use('/DeleteDoctor', DeleteDoctor);
 app.use('/updateDoctor',updateDoctor);

 app.use('/api/nurse',addNurse);
 app.use('/api/Nurse/getAll',getNurse);
 app.use('/deleteNurse', deleteNurse);
 app.use('/updateNurse', updateNurse); 

 app.use('/api/FireFighter',AddFireFighter);
 app.use('/api/FireFighter/getAll', getFireFighter);
 app.use('/deletefirefighter', deletefirefighter);
 app.use('/updateFireFighter',updateFireFighter);

 app.use('/api/message',addmessage );
 app.use('/api/message/getAll',getmessage);
 app.use('/deletemessage',deletemessage);
 app.use('/updateMessage',updateMessage);

 app.use('/api/Garde',addgarde );
 app.use('/api/garde/getAll',getgarde);
 app.use('/deletegarde',deletegarde);
 app.use('/updateGarde',updateGarde);

 app.use('/api/pharmacist',addpharmacist);
 app.use('/api/pharmacist/getAll',getpharmacist);
 app.use('/deletepharmacist',deletepharmacist);
 app.use('/updatePharmacist',updatePharmacist);

 app.use('/api/Transaction',addtransaction);
 app.use('/api/transaction/getAll',gettransaction);
 app.use('/deletetransaction',deletetransaction);
 app.use('/updateTransaction',updateTransaction);

 app.use('/api/auth', authRoutes);
 app.use('/api/sendEmail', sendEmailRoutes);

 app.use('/api/createAccount',createAccount);
// في نهاية ملف server.js
const port = process.env.PORT; // 

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});