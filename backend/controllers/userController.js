const User = require('../models/User');
const Group = require('../models/Group');





exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    // Start a transaction
    await session.startTransaction();

    // Find and delete the user
    const user = await User.findByIdAndDelete(req.params.id).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Remove user from group members
    await Group.updateMany(
      { 'members.user': user._id },
      { $pull: { members: { user: user._id } } },
      { session }
    );

    // Remove user from invitations
    await Group.updateMany(
      { 'invitations.userId': user._id },
      { $pull: { invitations: { userId: user._id } } },
      { session }
    );

    // Remove user from join requests
    await Group.updateMany(
      { 'joinRequests.user': user._id },
      { $pull: { joinRequests: { user: user._id } } },
      { session }
    );

    // Handle groups created by the user, set to null or reassign
    await Group.updateMany(
      { createdBy: user._id },
      { $set: { createdBy: null } }, // Consider reassigning to a new user or another admin
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

