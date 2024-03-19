const mongoose = require('mongoose');
const InvestmentProposalSchema = require('./InvestmentProposal').schema; // Notice the change here

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    privacy: { type: String, enum: ['public', 'private'], required: true },
    members: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
    }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    investmentProposals: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InvestmentProposal'
  }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    joinRequests: [{ 
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' } 
  }],
  invitations: [{ 
      email: { type: String, required: true }, 
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' } 
  }]

  });

module.exports = mongoose.model('Group', groupSchema);
