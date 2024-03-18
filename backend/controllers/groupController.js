const Group = require('../models/Group');

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newGroup = new Group({
      name,
      description,
      members: [req.user._id], // Assuming you're attaching user to req in auth middleware
    });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id });
    res.status(200).json(groups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchPublicGroups = async (req, res) => {
  const { query } = req.query; // Assuming you pass the search query as a URL parameter
  try {
    const groups = await Group.find({
      name: { $regex: query, $options: 'i' }, // Case-insensitive search
      isPublic: true, // Assuming you have an `isPublic` field
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  const { groupId } = req.params; // ID of the group to join
  try {
    const group = await Group.findById(groupId);
    if (!group.isPublic) {
      return res.status(403).json({ message: "Cannot join a private group." });
    }
    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();
      res.json({ message: "Joined the group successfully." });
    } else {
      res.status(400).json({ message: "Already a member of this group." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

