const mongoose = require('mongoose');

const investmentProposalSchema = new mongoose.Schema({
    title: String,
    description: String,
    amount: Number,
    cryptocurrency: String,
    votesFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    votesAgainst: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    privacy: { type: String, enum: ['public', 'private'], required: true },
    members: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
    }],
    investmentProposals: [investmentProposalSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', groupSchema);