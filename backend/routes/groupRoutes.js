const express = require('express');
const router = express.Router();
const {
  createGroup,
  fetchGroups,
  leaveGroup,
  searchGroups,
  joinGroup,
  updateGroup,
  deleteGroup,
  fetchGroupDetails,
  removeMember,
  promoteToAdmin,
  inviteUser,
  requestToJoin,
  getUserInvitations,
  acceptInvitation,
  rejectInvitation,
  acceptJoinRequest,
  rejectJoinRequest
  
} = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateCreateGroup,
  validateJoinGroup,
  validateUpdateGroup,
  validateDeleteGroup,
  validateLeaveGroup,
  validateFetchGroupDetails,
  validateFetchInvestmentProposals,
  validateCreateInvestmentProposal,
  validateVoteOnInvestmentProposal,
  validateRemoveMember,
  validatePromoteToAdmin,
  validateInviteUser,
  validateRequestToJoin
} = require('./validations/groupValidations');
const { validationResult } = require('express-validator');

// Middleware to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Specific routes
router.get('/invitations', authMiddleware, getUserInvitations);
router.get('/search', authMiddleware, searchGroups);

// Group creation and listing
router.post('/', [authMiddleware, ...validateCreateGroup, checkValidation], createGroup);
router.get('/', authMiddleware, fetchGroups);

// Actions on specific groups
router.post('/:groupId/join', [authMiddleware, ...validateJoinGroup, checkValidation], joinGroup);
router.get('/:groupId', [authMiddleware, ...validateFetchGroupDetails, checkValidation], fetchGroupDetails);
router.put('/:groupId', [authMiddleware, ...validateUpdateGroup, checkValidation], updateGroup);
router.delete('/:groupId', [authMiddleware, ...validateDeleteGroup, checkValidation], deleteGroup);
router.post('/leave/:groupId', [authMiddleware, ...validateLeaveGroup, checkValidation], leaveGroup);


// Member management
router.post('/:groupId/removeMember/:memberId', [authMiddleware, ...validateRemoveMember, checkValidation], removeMember);
router.post('/:groupId/promoteToAdmin/:memberId', [authMiddleware, ...validatePromoteToAdmin, checkValidation], promoteToAdmin);

// Invitation and join requests
router.post('/:groupId/invite', [authMiddleware, ...validateInviteUser, checkValidation], inviteUser);
router.post('/:groupId/request-join', [authMiddleware, ...validateRequestToJoin, checkValidation], requestToJoin);
router.post('/:groupId/invitations/accept', authMiddleware, acceptInvitation);
router.post('/:groupId/invitations/reject', authMiddleware, rejectInvitation);
router.post('/:groupId/join-requests/:requestId/accept', authMiddleware, acceptJoinRequest);
router.delete('/:groupId/join-requests/:requestId', authMiddleware, rejectJoinRequest);


module.exports = router;
