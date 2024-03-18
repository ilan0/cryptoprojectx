const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  invitations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  investmentGoals: String,
  isPublic: {
    type: Boolean,
    default: true, // Assuming groups are private by default
  },
  // Add more fields as necessary
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
