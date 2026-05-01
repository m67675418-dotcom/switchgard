const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    gardeId: { type: String, ref: 'User' }, 
    demanderId: { type: String, ref: 'User' },
    status: { type: String, default: 'en_attente' }
}, {
    collection: "Transaction",
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);