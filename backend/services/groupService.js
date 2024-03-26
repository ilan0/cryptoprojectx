const Group = require('../models/Group');
const User = require('../models/User');
const mongoose = require('mongoose');


exports.inviteUserByEmail = async (groupId, userEmail, inviterId) => {
    try {
      console.log(`Inviting user to group. GroupId: ${groupId}, UserEmail: ${userEmail}, InviterId: ${inviterId}`);
  
      const group = await Group.findById(groupId);
      console.log(`Found group: `, group);
  
      if (!group) {
        console.log('Error: Group not found');
        throw new Error('Group not found');
      }
  
      // Ensure the inviter is a member of the group
      const isMember = group.members.some(member => member.user.toString() === inviterId.toString());
      if (!isMember) {
        console.log('Error: Only group members can invite users');
        throw new Error('Only group members can invite users');
      }
  
      // Attempt to find the user by their email address
      const user = await User.findOne({ email: userEmail });
      const userId = user ? user._id : null;
  
      // Check if the user is already a member or has been invited
      const isAlreadyInvitedOrMember = group.members.some(member => user && member.user.equals(userId)) ||
                                       group.invitations.some(invitation => invitation.email === userEmail);
  
      if (isAlreadyInvitedOrMember) {
        console.log('Error: User is already a member or has been invited');
        throw new Error('User is already a member or has been invited');
      }
  
      // Create the invitation
      const invitation = {
        email: userEmail,
        invitedBy: inviterId,
        invitedAt: new Date(),
        status: 'pending',
        ...(userId && { userId: userId }), // Add the userId if the user exists
      };
      console.log(`Creating invitation: `, invitation);
  
      // Push the invitation object to the group's invitations and save
      group.invitations.push(invitation);
      await group.save();
  
      console.log(`Invitation successfully added to group. GroupId: ${groupId}`);
    } catch (error) {
      console.error("Error inviting user to group:", error);
      throw error;
    }
  };
  

  exports.requestToJoinGroup = async (groupId, userId) => {
    console.log(`[requestToJoinGroup] Called with groupId: ${groupId}, userId: ${userId}`);

    const group = await Group.findById(groupId)
                            .populate('members.user')
                            .populate('joinRequests.user');

    if (!group) {
        console.error('[requestToJoinGroup] Group not found');
        throw new Error('Group not found');
    }

    console.log(`[requestToJoinGroup] Found group: `, group);

    if (group.privacy !== 'private') {
        console.error('[requestToJoinGroup] Only private groups can have join requests');
        throw new Error('Only private groups can have join requests');
    }

    // Debugging: Log the members and joinRequests arrays
    console.log(`[requestToJoinGroup] Members: ${JSON.stringify(group.members, null, 2)}`);
    console.log(`[requestToJoinGroup] JoinRequests: ${JSON.stringify(group.joinRequests, null, 2)}`);

    const isAlreadyMember = group.members.some(member => member.user._id.equals(userId));
    const hasAlreadyRequested = group.joinRequests.some(request => request.user._id.equals(userId));

    console.log(`[requestToJoinGroup] Is already member: ${isAlreadyMember}`);
    console.log(`[requestToJoinGroup] Has already requested: ${hasAlreadyRequested}`);

    if (isAlreadyMember) {
        console.error('[requestToJoinGroup] User is already a member of the group');
        throw new Error('User is already a member of the group');
    }

    if (hasAlreadyRequested) {
        console.error('[requestToJoinGroup] User has already requested to join the group');
        throw new Error('User has already requested to join the group');
    }

    group.joinRequests.push({ user: userId });
    await group.save();

    console.log('[requestToJoinGroup] Join request added successfully');
};






exports.getUserInvitations = async (userEmail) => {
    console.log(`[getUserInvitations] Called with userEmail: ${userEmail}`);
    try {
        // Use the `invitations.email` and `invitations.status` to filter groups
        const groupsWithInvitations = await Group.find({
            "invitations.email": userEmail,
            "invitations.status": "pending"
        }, 'name invitations.$').populate('invitations.invitedBy', 'username'); // Populate the inviter's username if needed

        const invitations = groupsWithInvitations.map(group => ({
            groupId: group._id,
            groupName: group.name,
            // The projection with the `$` operator should ensure that `invitations` is an array with a single element
            invitation: group.invitations[0] // Extract the first (and only) invitation for simplification
        }));

        console.log(`[getUserInvitations] Processed invitations:`, invitations);
        return invitations;
    } catch (error) {
        console.error(`[getUserInvitations] Error:`, error);
        throw error;
    }
};
exports.acceptInvitation = async (groupId, userEmail, userIdFromToken) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const group = await Group.findById(groupId).session(session);
            if (!group) throw new Error('Group not found.');

            // Find the invitation for the userEmail
            const invitation = group.invitations.find(invite => invite.email === userEmail);
            if (!invitation || !invitation.userId || !invitation.userId.equals(userIdFromToken)) {
                throw new Error('Invitation not found or does not match user.');
            }

            // Update the invitation status to 'accepted'
            invitation.status = 'accepted';

            // Check if the user is already in the members array
            const isAlreadyMember = group.members.some(member => member.user.equals(userIdFromToken));
            if (!isAlreadyMember) {
                // Add the user to the group members
                group.members.push({ user: userIdFromToken, role: 'member' });
            }

            await group.save({ session });
            console.log('Invitation accepted successfully.');
        });
    } catch (error) {
        console.error('Error accepting invitation:', error);
        throw error; // The error will be caught by the transaction's abort logic
    } finally {
        session.endSession();
    }
};

exports.rejectInvitation = async (groupId, userIdFromToken) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const group = await Group.findById(groupId).session(session);
            if (!group) throw new Error('Group not found.');

            // Logging for debugging
            console.log(`Token UserId: ${userIdFromToken}`);
            console.log('Invitations in group:', group.invitations);

            // Ensure userIdFromToken is correctly formatted as a string
            const userIdString = userIdFromToken.toString();

            // Find the invitation for the authenticated user
            const invitationIndex = group.invitations.findIndex(invite => 
                invite.userId && invite.userId.toString() === userIdString
            );

            // Logging for debugging
            console.log(`Looking for userId: ${userIdString}, found at index: ${invitationIndex}`);

            if (invitationIndex === -1) throw new Error('Invitation not found.');

            // Optionally, if you want to ensure the invitation is pending before rejecting
            if (group.invitations[invitationIndex].status !== 'pending') {
                throw new Error('Invitation is not pending.');
            }

            // Update the invitation status to 'rejected'
            group.invitations[invitationIndex].status = 'rejected';

            await group.save({ session });
            console.log('Invitation rejected successfully.');
        });
    } catch (error) {
        console.error('Error rejecting invitation:', error);
        throw error; // The error will be caught by the transaction's abort logic
    } finally {
        session.endSession();
    }
};





exports.acceptJoinRequest = async (groupId, requestId) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const group = await Group.findById(groupId).session(session);
            if (!group) throw new Error('Group not found.');

            // Find the join request and add the user to the group's members
            const requestIndex = group.joinRequests.findIndex(request => request._id.equals(requestId));
            if (requestIndex === -1) throw new Error('Join request not found.');

            const userId = group.joinRequests[requestIndex].user;
            const isAlreadyMember = group.members.some(member => member.user.equals(userId));

            if (!isAlreadyMember) {
                group.members.push({ user: userId, role: 'member' });
            }
            
            group.joinRequests.splice(requestIndex, 1);
            
            await group.save({ session });
        });

        console.log('Join request accepted successfully.');
    } catch (error) {
        console.error('Error accepting join request:', error);
        throw error; // The error will be caught by the transaction's abort logic
    } finally {
        session.endSession();
    }
};

exports.rejectJoinRequest = async (groupId, requestId) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const group = await Group.findById(groupId).session(session);
            if (!group) throw new Error('Group not found.');

            // Use ObjectId's equals method for comparison
            const requestIndex = group.joinRequests.findIndex(request => request._id.equals(requestId));
            if (requestIndex === -1) throw new Error('Join request not found.');

            // Simply remove the join request
            group.joinRequests.splice(requestIndex, 1);

            await group.save({ session });
        });

        console.log('Join request rejected successfully.');
    } catch (error) {
        console.error('Error rejecting join request:', error);
        throw error; // The error will be caught by the transaction's abort logic
    } finally {
        session.endSession();
    }
};
