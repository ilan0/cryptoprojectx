const express = require('express');
const { searchPublicGroups, createGroup, fetchGroups, joinGroup } = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have this

const router = express.Router();

router.post('/', authMiddleware, createGroup);
router.get('/', authMiddleware, fetchGroups);
router.get('/search', searchPublicGroups);
router.post('/:groupId/join', authMiddleware, joinGroup);

module.exports = router;
