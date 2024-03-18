const Group = require('../models/Group');

// Create a new group
exports.createGroup = async (req, res) => {
    try {
        const group = new Group({
            ...req.body,
            createdBy: req.user._id,
            members: [{ userId: req.user._id, role: 'admin' }]
        });
        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ message: "Error creating group", error: error.toString() });
    }
};

// Fetch groups the user is a member of
exports.fetchGroups = async (req, res) => {
    try {
        const groups = await Group.find({ 'members.userId': req.user._id });
        res.status(200).json(groups);
    } catch (error) {
        res.status(400).json({ message: "Error fetching groups", error: error.toString() });
    }
};

// Search for public groups
exports.searchPublicGroups = async (req, res) => {
    try {
        const { query } = req.query;
        const groups = await Group.find({ 
            name: { $regex: query, $options: 'i' }, 
            privacy: 'public'
        });
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Error searching for groups", error: error.toString() });
    }
};

// Join a public group
exports.joinGroup = async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.groupId, privacy: 'public' });
        if (!group) {
            return res.status(404).json({ message: "Group not found or is not public" });
        }
        // Check if the user is already a member
        const isMember = group.members.some(member => member.userId.equals(req.user._id));
        if (isMember) {
            return res.status(400).json({ message: "User is already a member of this group" });
        }
        group.members.push({ userId: req.user._id, role: 'member' });
        await group.save();
        res.status(200).json({ message: "Successfully joined the group" });
    } catch (error) {
        res.status(500).json({ message: "Error joining group", error: error.toString() });
    }
};

// Update a group's details (for group admins)
exports.updateGroup = async (req, res) => {
    try {
        const group = await Group.findOneAndUpdate(
            { _id: req.params.groupId, 'members.userId': req.user._id, 'members.role': 'admin' },
            { ...req.body },
            { new: true }
        );
        if (!group) {
            return res.status(404).json({ message: "Group not found or you don't have admin rights" });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ message: "Error updating group", error: error.toString() });
    }
};

// Delete a group (for group admins)
exports.deleteGroup = async (req, res) => {
    try {
        const group = await Group.findOneAndDelete({ _id: req.params.groupId, 'members.userId': req.user._id, 'members.role': 'admin' });
        if (!group) {
            return res.status(404).json({ message: "Group not found or you don't have admin rights" });
        }
        res.status(200).json({ message: "Group successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting group", error: error.toString() });
    }
};

exports.createInvestmentProposal = async (req, res) => {
  const { groupId } = req.params;
  const proposalData = req.body;

  try {
      const group = await Group.findById(groupId);
      if (!group) {
          return res.status(404).json({ message: "Group not found" });
      }

      // Check if the user is a member of the group
      const isMember = group.members.some(member => member.userId.equals(req.user._id));
      if (!isMember) {
          return res.status(403).json({ message: "You must be a member of the group to create an investment proposal." });
      }

      // Add the proposal to the group
      group.investmentProposals.push({ ...proposalData, createdBy: req.user._id });
      await group.save();

      res.status(201).json({ message: "Investment proposal created successfully", group });
  } catch (error) {
      res.status(500).json({ message: "Error creating investment proposal", error: error.toString() });
  }
};


exports.voteOnInvestmentProposal = async (req, res) => {
  const { groupId, proposalId } = req.params;
  const { vote } = req.body; // 'for' or 'against'

  try {
      const group = await Group.findById(groupId);
      if (!group) {
          return res.status(404).json({ message: "Group not found" });
      }

      // Check if the user is a member of the group
      const isMember = group.members.some(member => member.userId.equals(req.user._id));
      if (!isMember) {
          return res.status(403).json({ message: "You must be a member of the group to vote on an investment proposal." });
      }

      // Find the proposal
      const proposal = group.investmentProposals.id(proposalId);
      if (!proposal) {
          return res.status(404).json({ message: "Investment proposal not found" });
      }

      // Check if the user has already voted
      const hasVoted = proposal.votesFor.includes(req.user._id) || proposal.votesAgainst.includes(req.user._id);
      if (hasVoted) {
          return res.status(400).json({ message: "You have already voted on this proposal" });
      }

      // Cast the vote
      if (vote === 'for') {
          proposal.votesFor.push(req.user._id);
      } else if (vote === 'against') {
          proposal.votesAgainst.push(req.user._id);
      } else {
          return res.status(400).json({ message: "Invalid vote. Must be 'for' or 'against'." });
      }

      await group.save();
      res.status(200).json({ message: "Vote cast successfully", group });
  } catch (error) {
      res.status(500).json({ message: "Error voting on investment proposal", error: error.toString() });
  }
};

