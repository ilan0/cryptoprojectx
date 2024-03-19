const express = require('express');
const router = express.Router();
const { 
    createGroup, 
    fetchGroups, 
    leaveGroup,
    searchPublicGroups, 
    joinGroup, 
    updateGroup, 
    deleteGroup, 
    createInvestmentProposal, 
    voteOnInvestmentProposal,
    fetchGroupDetails,
    fetchInvestmentProposals,
    removeMember, 
    promoteToAdmin,
    requestJoinGroup,
    inviteUser
} = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');
   
router.post('/', authMiddleware, createGroup);
router.get('/', authMiddleware, fetchGroups);
router.get('/search', authMiddleware, searchPublicGroups);
router.post('/:groupId/join', authMiddleware, joinGroup);
router.get('/:groupId', authMiddleware, fetchGroupDetails);
router.put('/:groupId', authMiddleware, updateGroup);
router.delete('/:groupId', authMiddleware, deleteGroup);
router.post('/leave/:groupId', authMiddleware, leaveGroup);
router.get('/:groupId/investment-proposals', authMiddleware, fetchInvestmentProposals);
router.post('/:groupId/investment-proposals', authMiddleware, createInvestmentProposal);
router.post('/:groupId/investment-proposals/:proposalId/vote', authMiddleware, voteOnInvestmentProposal);
router.post('/:groupId/removeMember/:memberId', authMiddleware, removeMember);
router.post('/:groupId/promoteToAdmin/:memberId', authMiddleware, promoteToAdmin);
router.post('/:groupId/join', authMiddleware, joinGroup);
router.post('/:groupId/join-request', authMiddleware, requestJoinGroup);
router.post('/:groupId/invite', authMiddleware, inviteUser);
module.exports = router;
