const { body, param, query } = require('express-validator');

exports.validateCreateGroup = [
  body('name').trim().notEmpty().withMessage('Group name is required.'),
  body('description').optional().isString(),
  body('privacy').isIn(['public', 'private']).withMessage('Privacy must be either "public" or "private".'),
];

exports.validateJoinGroup = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
];

exports.validateUpdateGroup = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
  body('name').optional().trim().isString(),
  body('description').optional().isString(),
  body('privacy').optional().isIn(['public', 'private']).withMessage('Privacy must be either "public" or "private".'),
];

exports.validateDeleteGroup = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
];

exports.validateLeaveGroup = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
];

exports.validateFetchGroupDetails = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
];

exports.validateFetchInvestmentProposals = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
];

exports.validateCreateInvestmentProposal = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
  body('proposal').notEmpty().withMessage('Proposal content is required.'),
  // Add more specific validation for the contents of the proposal as needed
];

exports.validateVoteOnInvestmentProposal = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
  param('proposalId').isMongoId().withMessage('Invalid Proposal ID format.'),
  body('vote').isIn(['for', 'against']).withMessage('Vote must be either "for" or "against".'),
];

exports.validateRemoveMember = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
  param('memberId').isMongoId().withMessage('Invalid Member ID format.'),
];

exports.validatePromoteToAdmin = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
  param('memberId').isMongoId().withMessage('Invalid Member ID format.'),
];

exports.validateInviteUser = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
  //body('email').isEmail().withMessage('Invalid email format.'),
];

exports.validateRequestToJoin = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
];

exports.validateRespondToInvitationOrRequest = [
  param('groupId').isMongoId().withMessage('Invalid Group ID format.'),
  body('action').isIn(['accept', 'reject']).withMessage('Action must be either "accept" or "reject".'),
  // Depending on whether you're using userId or userEmail, include validation for one or both as optional
  body('userEmail').optional().isEmail().withMessage('Invalid email format.'),
];

// You might need to adjust these based on the exact structure of your requests and your application needs
