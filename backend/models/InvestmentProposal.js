const mongoose = require('mongoose');

const investmentProposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amountRequired: {
    type: Number,
    required: true,
  },
  investmentCurrency: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  votesFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  votesAgainst: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: true,
  },
  // Optionally include fields for managing the investment once approved
  investmentDetails: {
    // Details about how the investment is managed, monitored, or any other relevant information
    transactionHash: String, // For blockchain-based investments
    investmentOutcome: String,
    finalAmount: Number,
    completedAt: Date,
  },
}, { timestamps: true });

const InvestmentProposal = mongoose.model('InvestmentProposal', investmentProposalSchema);

module.exports = InvestmentProposal;