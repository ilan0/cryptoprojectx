const express = require('express');
const router = express.Router();
const { 
    createGroup, 
    fetchGroups, 
    searchPublicGroups, 
    joinGroup, 
    updateGroup, 
    deleteGroup, 
    createInvestmentProposal, 
    voteOnInvestmentProposal 
} = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createGroup);
router.get('/', authMiddleware, fetchGroups);
router.get('/search', authMiddleware, searchPublicGroups);
router.post('/:groupId/join', authMiddleware, joinGroup);
router.put('/:groupId', authMiddleware, updateGroup);
router.delete('/:groupId', authMiddleware, deleteGroup);
router.post('/:groupId/investment-proposals', authMiddleware, createInvestmentProposal);
router.post('/:groupId/investment-proposals/:proposalId/vote', authMiddleware, voteOnInvestmentProposal);

module.exports = router;
