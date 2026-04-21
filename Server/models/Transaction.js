const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    gardeId: { type: String, ref: 'User' }, 
    demanderId: { type: String, ref: 'User' },
    status: { type: String, default: 'en_attente' }
}, 
{collection: "Transaction"});
module.exports = mongoose.model('Transaction', transactionSchema);