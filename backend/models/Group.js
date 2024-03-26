const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  invitedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Add this line
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  privacy: { type: String, enum: ['public', 'private'], default: 'public' },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  joinRequests: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  invitations: [invitationSchema],
});

module.exports = mongoose.model('Group', groupSchema);
