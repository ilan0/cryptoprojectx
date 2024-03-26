const Group = require('../models/Group');
const User = require('../models/User');
const groupService = require('../services/groupService');
const mongoose = require('mongoose');
// Create a new group
exports.createGroup = async (req, res) => {
  try {
    // Prepare the group data with the creator as an admin member
    const groupData = {
      ...req.body,
      createdBy: req.user._id,
      // Use 'user' instead of 'userId' to match the schema
      members: [{ user: req.user._id, role: 'admin' }],
    };

    const group = new Group(groupData);

    // Start a session for a transaction
    const session = await mongoose.startSession();
    await session.startTransaction();

    // Save the new group
    await group.save({ session });

    // Update the user's groups array to include this new group
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id }
    }, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    console.log("Group created: ", group);
    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group: ", error);
    if(session) {
      await session.abortTransaction();
      session.endSession();
    }
    res.status(400).json({ message: "Error creating group", error: error.toString() });
  }
};


// Fetch groups the user is a member of
exports.fetchGroups = async (req, res) => {
  try {
    // Find all groups where the user is listed as a member (regardless of role)
    const groups = await Group.find({'members.user': req.user._id})
                              .populate('members.user', 'username email') // Correctly populate the 'user' field
                              .populate('createdBy', 'username email'); // Populate investment proposals if needed

    // You can send the groups directly as they contain populated member details
    // If you need to format the groups differently, you can map over them as done below

    const formattedGroups = groups.map(group => {
      const groupObject = group.toObject(); // Convert the mongoose document to a plain object
      delete groupObject.__v; // Optionally delete fields you don't want to include in the response
      return groupObject;
    });

    res.json(formattedGroups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).send({ message: "Error fetching groups", error: error.toString() });
  }
};


exports.searchGroups = async (req, res) => {
  try {
      const { query } = req.query;

      // Check if the query parameter is provided
      if (!query) {
          return res.status(400).json({ message: "Please provide a search query." });
      }

      const groups = await Group.find({ 
          name: { $regex: query, $options: 'i' }, // Case-insensitive search
          // Removed the privacy filter to include both public and private groups
      });

      // If no groups were found, send a message indicating so
      if (groups.length === 0) {
          return res.status(404).json({ message: "No groups found matching your query." });
      }

      // Successfully found groups, return them
      res.status(200).json({ message: `Found ${groups.length} groups matching '${query}'.`, groups });
  } catch (error) {
      console.error("Search groups error:", error); // Log the error for server-side debugging
      res.status(500).json({ message: "Error searching for groups", error: error.message });
  }
};


exports.updateGroup = async (req, res) => {
  try {
    // First, find the group to ensure it exists and to check for admin rights
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Check if the requesting user is an admin of the group
    const isAdmin = group.members.some(member => member.userId.equals(req.user._id) && member.role === 'admin');
    if (!isAdmin) {
      return res.status(403).json({ message: "Not authorized." });
    }

    // Perform the update since the user is confirmed to be an admin
    const updatedGroup = await Group.findByIdAndUpdate(req.params.groupId, req.body, { new: true });
    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Error updating group", error: error.toString() });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    // Find the group to ensure it exists and to check for admin rights
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Check if the requesting user is an admin of the group
    const isAdmin = group.members.some(member => member.userId.equals(req.user._id) && member.role === 'admin');
    if (!isAdmin) {
      return res.status(403).json({ message: "Not authorized." });
    }

    // Delete the group since the user is confirmed to be an admin
    await Group.findByIdAndDelete(req.params.groupId);
    res.status(200).json({ message: "Group successfully deleted" });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ message: "Error deleting group", error: error.toString() });
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

exports.updateGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    // First, find the group to check for admin rights
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).send({ message: "Group not found." });
    }

    // Check if the current user is an admin in the group
    const isAdmin = group.members.some(member => member.user.equals(req.user._id) && member.role === 'admin');
    if (!isAdmin) {
      return res.status(403).send({ message: "You do not have admin rights to update this group." });
    }

    // If the user is an admin, proceed with the update
    const updatedGroup = await Group.findByIdAndUpdate(groupId, req.body, { new: true })
                                       .populate('members.user', 'username email') // Populate member details
                                       .populate('createdBy', 'username email'); // Populate creator details

    res.json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).send({ message: "Failed to update group", error: error.message });
  }
};

// In GroupController.js

exports.fetchGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
                            .populate('members.user', 'username email') // Corrected to populate 'user'
                            .populate('createdBy', 'username email'); // Populate the investment proposals

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // The group object already contains member details, including the role and populated user document
    // There is no need to map over the members array unless you need to transform the data further

    // You can directly send the group object as a response
    // If you want to remove certain fields like _id, you can do that using .toObject() and delete

    const groupDetails = group.toObject(); // Convert to a plain object
    delete groupDetails.__v; // Optionally delete fields you don't want to include in the response

    res.json(groupDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching group details", error: error.toString() });
  }
};



exports.removeMember = async (req, res) => {
  const { groupId, memberId } = req.params;

  try {
      const group = await Group.findById(groupId);
      if (!group) {
          return res.status(404).json({ message: "Group not found." });
      }

      // Check if the current user is an admin of the group
      const isRequestingUserAdmin = group.members.some(
        member => member.userId.equals(req.user._id) && member.role === 'admin'
      );
      
      if (!isRequestingUserAdmin) {
          return res.status(403).json({ message: "Not authorized. Only admins can remove members." });
      }

      // Find the member to be removed
      const memberIndex = group.members.findIndex(member => member.userId.equals(memberId));

      // If the member is not found, return an error
      if (memberIndex === -1) {
          return res.status(404).json({ message: "Member not found in the group." });
      }

      // Remove the member from the group
      group.members.splice(memberIndex, 1);
      await group.save();

      res.json({ message: "Member removed successfully.", group });
  } catch (error) {
      console.error("Error removing member:", error);
      res.status(500).json({ message: "Error removing member", error: error.toString() });
  }
};

exports.promoteToAdmin = async (req, res) => {
  const { groupId, memberId } = req.params;

  try {
      const group = await Group.findById(groupId);
      if (!group) {
          return res.status(404).json({ message: "Group not found." });
      }

      // Check if current user is an admin of the group
      const isRequestingUserAdmin = group.members.some(member => member.userId.equals(req.user._id) && member.role === 'admin');
      if (!isRequestingUserAdmin) {
          return res.status(403).json({ message: "Not authorized." });
      }

      // Check if the user is already an admin
      const isMemberAlreadyAdmin = group.members.some(member => member.userId.equals(memberId) && member.role === 'admin');
      if (isMemberAlreadyAdmin) {
          return res.status(400).json({ message: "User is already an admin." });
      }

      // Promote the user to admin
      const memberIndex = group.members.findIndex(member => member.userId.equals(memberId));
      if (memberIndex !== -1) {
          group.members[memberIndex].role = 'admin'; // Promote to admin
          await group.save();
          return res.json({ message: "User promoted to admin successfully." });
      } else {
          return res.status(404).json({ message: "User not found in group." });
      }
  } catch (error) {
      console.error("Error promoting to admin:", error);
      res.status(500).json({ message: "Error promoting to admin", error: error.toString() });
  }
};

exports.joinGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
      const group = await Group.findById(groupId);
      if (!group) {
          return res.status(404).json({ message: "Group not found" });
      }

      // Check if the user is already a member of the group
      const isMember = group.members.some(member => member.userId.equals(req.user._id));
      if (isMember) {
          return res.status(400).json({ message: "User is already a member of this group" });
      }

      // Add the user as a member
      group.members.push({ userId: req.user._id, role: 'member' });
      await group.save();

      res.json({ message: "Joined the group successfully", group });
  } catch (error) {
      console.error("Error joining group:", error);
      res.status(500).json({ message: "Error joining group", error: error.toString() });
  }
};

exports.inviteUser = async (req, res) => {
  const { groupId } = req.params;
  const { userEmail } = req.body;
  try {
    await groupService.inviteUserByEmail(groupId, userEmail, req.user._id);
    res.status(200).json({ message: "User invited successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request to join a group
exports.requestToJoin = async (req, res) => {
  const { groupId } = req.params;
  try {
    await groupService.requestToJoinGroup(groupId, req.user._id);
    res.status(200).json({ message: "Request to join sent successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's invitations
exports.getUserInvitations = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const invitations = await groupService.getUserInvitations(userEmail);
    res.status(200).json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error.message);
    res.status(500).json({ message: error.message });
  }
};
exports.acceptInvitation = async (req, res) => {
  const { groupId } = req.params;
  const userEmail = req.user.email; // Assuming email is available in req.user
  const userId = req.user._id; // Assuming userId is available in req.user

  try {
      await groupService.acceptInvitation(groupId, userEmail, userId);
      res.json({ message: "Invitation accepted successfully." });
  } catch (error) {
      console.error("Error accepting invitation:", error);
      res.status(500).json({ message: error.message });
  }
};
exports.rejectInvitation = async (req, res) => {
  const { groupId } = req.params;
  // Now, you only need the userId from the token, not the userEmail
  const userId = req.user._id; // Assuming userId is available in req.user

  try {
    // Pass only groupId and userId to the service function
    await groupService.rejectInvitation(groupId, userId);
    res.json({ message: "Invitation rejected successfully." });
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.acceptJoinRequest = async (req, res) => {
  const { groupId, requestId } = req.params;

  // Here, you might want to ensure that the current user is an admin of the group
  // This check is omitted for brevity but should be implemented for security

  try {
      await groupService.acceptJoinRequest(groupId, requestId);
      res.json({ message: "Join request accepted successfully." });
  } catch (error) {
      console.error("Error accepting join request:", error);
      res.status(500).json({ message: error.message });
  }
};

exports.rejectJoinRequest = async (req, res) => {
  const { groupId, requestId } = req.params;

  // As with acceptJoinRequest, ensure the current user has the authority to reject the request

  try {
      await groupService.rejectJoinRequest(groupId, requestId);
      res.json({ message: "Join request rejected successfully." });
  } catch (error) {
      console.error("Error rejecting join request:", error);
      res.status(500).json({ message: error.message });
  }
};




