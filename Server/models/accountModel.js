const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    role: {type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String } // للتنقل في الـ Map
}, {collection: "accounts"});

module.exports = mongoose.model('Account', accountSchema);