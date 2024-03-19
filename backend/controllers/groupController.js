const Group = require('../models/Group');
const User = require('../models/User');
const InvestmentProposal = require('../models/InvestmentProposal');
// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const group = new Group({
      ...req.body,
      createdBy: req.user._id,
      members: [{ userId: req.user._id, role: 'admin' }],
      admins: [req.user._id], // Ensure the creator's ID is added here
    });
    await group.save();
    console.log("Group created: ", group); // Debug log
    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group: ", error); // Error log
    res.status(400).json({ message: "Error creating group", error: error.toString() });
  }
};


// Fetch groups the user is a member of
exports.fetchGroups = async (req, res) => {
  try {
      const groups = await Group.find({'members.userId': req.user._id}).populate('admins', 'id'); // Adjust based on your schema
      res.json(groups);
  } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).send({ message: "Error fetching groups", error: error.toString() });
  }
};

// Search for public groups
exports.searchPublicGroups = async (req, res) => {
  try {
      const { query } = req.query;

      // Check if the query parameter is provided
      if (!query) {
          return res.status(400).json({ message: "Please provide a search query." });
      }

      const groups = await Group.find({ 
          name: { $regex: query, $options: 'i' }, // Case-insensitive search
          privacy: 'public' // Search only within public groups
      });

      // If no groups were found, send a message indicating so
      if (groups.length === 0) {
          return res.status(404).json({ message: "No public groups found matching your query." });
      }

      // Successfully found groups, return them
      res.status(200).json({ message: `Found ${groups.length} public groups matching '${query}'.`, groups });
  } catch (error) {
      console.error("Search public groups error:", error); // Log the error for server-side debugging
      res.status(500).json({ message: "Error searching for groups", error: error.message });
  }
};


// Update a group's details (for group admins)
exports.updateGroup = async (req, res) => {
  try {
      const group = await Group.findOneAndUpdate({
          _id: req.params.groupId,
          admins: { $in: [req.user._id] } // Ensure user is an admin
      }, req.body, { new: true });

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

exports.leaveGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.user._id;

  try {
      // Find the group and remove the user from it
      const groupUpdate = await Group.findByIdAndUpdate(groupId, {
          $pull: { members: { userId } }
      }, { new: true });

      // If the group wasn't updated, the user wasn't a member
      if (!groupUpdate) {
          return res.status(404).json({ message: "Group not found or user is not a member." });
      }

      // Remove the group from the user's groups array
      const userUpdate = await User.findByIdAndUpdate(userId, {
          $pull: { groups: groupId }
      }, { new: true });

      // Check if the user document was updated
      if (!userUpdate) {
          return res.status(404).json({ message: "User not found or group not in user's groups." });
      }

      res.json({ message: "Successfully left the group." });
  } catch (error) {
      console.error(error); // For debugging
      res.status(500).json({ message: "Failed to leave group", error: error.toString() });
  }
};

exports.createInvestmentProposal = async (req, res) => {
  const { groupId } = req.params;
  const proposal = req.body;
  proposal.createdBy = req.user._id; // Add the creator's ID to the proposal

  try {
    const group = await Group.findById(groupId);
    group.investmentProposals.push(proposal);
    await group.save();
    res.status(201).json({ message: 'Investment proposal created successfully.' });
  } catch (error) {
    res.status(500).send({ message: "Failed to create investment proposal", error: error.message });
  }
};

exports.voteOnInvestmentProposal = async (req, res) => {
  const { groupId, proposalId, vote } = req.params;

  try {
    const group = await Group.findOne({ _id: groupId, "investmentProposals._id": proposalId });
    if (!group) {
      return res.status(404).send({ message: "Group or proposal not found." });
    }

    // Find the proposal and update the vote
    const proposalIndex = group.investmentProposals.findIndex(p => p._id.equals(proposalId));
    group.investmentProposals[proposalIndex].votes.push({ userId: req.user._id, vote });

    await group.save();
    res.json({ message: "Vote registered successfully." });
  } catch (error) {
    res.status(500).send({ message: "Failed to vote on investment proposal", error: error.message });
  }
};

exports.updateGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findOneAndUpdate(
      { _id: groupId, "members.userId": req.user._id, "members.role": "admin" },
      req.body,
      { new: true }
    );

    if (!group) {
      return res.status(404).send({ message: "Group not found or you don't have admin rights." });
    }

    res.json(group);
  } catch (error) {
    res.status(500).send({ message: "Failed to update group", error: error.message });
  }
};
// In GroupController.js

exports.fetchGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('admins');
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: "Error fetching group details", error: error.toString() });
  }
};


exports.fetchInvestmentProposals = async (req, res) => {
  try {
    // Assuming InvestmentProposal is your model for proposals
    const investmentProposals = await InvestmentProposal.find({ groupId: req.params.groupId });
    res.json(investmentProposals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch investment proposals", error: error.toString() });
  }
};

exports.removeMember = async (req, res) => {
  const { groupId, memberId } = req.params;

  try {
    // Remove member from the group
    const group = await Group.findByIdAndUpdate(groupId, {
      $pull: { members: { userId: memberId } }
    }, { new: true });

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    res.json({ message: "Member removed successfully.", group });
  } catch (error) {
    res.status(500).json({ message: "Error removing member", error: error.toString() });
  }
};

// Promote a member to admin
exports.promoteToAdmin = async (req, res) => {
  const { groupId, memberId } = req.params;

  try {
    // Add member to the admins array
    const group = await Group.findByIdAndUpdate(groupId, {
      $addToSet: { admins: memberId }
    }, { new: true });

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    res.json({ message: "Member promoted to admin successfully.", group });
  } catch (error) {
    res.status(500).json({ message: "Error promoting member", error: error.toString() });
  }
};

exports.joinGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id; // Assuming you have middleware to authenticate and set req.user

  try {
      const group = await Group.findById(groupId);
      if (!group) {
          return res.status(404).json({ message: "Group not found" });
      }

      // Check if the user is already a member
      const isMember = group.members.some(member => member.userId.equals(userId));
      if (isMember) {
          return res.status(400).json({ message: "User is already a member of this group" });
      }

      // Add the user to the group's members list
      group.members.push({ userId: userId, role: 'member' });
      await group.save();

      // Optionally, add the group to the user's list of groups
      await User.findByIdAndUpdate(userId, { $push: { groups: groupId } });

      res.status(200).json({ message: "Successfully joined the group" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};
exports.requestJoinGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id; // Assuming you have middleware to set req.user

  try {
      const group = await Group.findById(groupId);

      if (!group) return res.status(404).send('Group not found.');
      if (group.privacy !== 'private') return res.status(400).send('This group is not private.');
      
      const alreadyRequestedOrMember = group.joinRequests.some(request => request.userId.equals(userId)) || 
                                        group.members.some(member => member.userId.equals(userId));

      if (alreadyRequestedOrMember) {
          return res.status(400).send('Already requested to join or is a member.');
      }

      group.joinRequests.push({ userId: userId });
      await group.save();

      res.status(200).send('Join request sent.');
  } catch (error) {
      res.status(500).send(error.message);
  }
};

exports.inviteUser = async (req, res) => {
  const { groupId } = req.params;
  const { email } = req.body; // Validate this in a real app

  try {
      const group = await Group.findById(groupId);

      if (!group) return res.status(404).send('Group not found.');
      const alreadyInvited = group.invitations.some(invite => invite.email === email);

      if (alreadyInvited) {
          return res.status(400).send('Already invited.');
      }

      group.invitations.push({ email: email });
      await group.save();

      // Here, send an email to the invited user using an email service

      res.status(200).send('User invited.');
  } catch (error) {
      res.status(500).send(error.message);
  }
};