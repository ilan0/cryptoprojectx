const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
});

userSchema.pre('save', async function (next) {
  const user = this;
  
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  
  next();
});

// Modify how Mongoose serializes the document
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  
  // Remove the password and version key (__v) from the response
  delete userObject.password;
  delete userObject.__v;
  
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
