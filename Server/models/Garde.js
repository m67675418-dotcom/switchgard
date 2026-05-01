const mongoose = require('mongoose');

const GardeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    owner: { type: String, ref: 'Garde' },
    dateGarde: { type: Date, required: true },
    status: { type: String, default: 'disponible' }
}, {
    collection: "Garde",
    timestamps: true
});

module.exports = mongoose.model('Garde', GardeSchema);