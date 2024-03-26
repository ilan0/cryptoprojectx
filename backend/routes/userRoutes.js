const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// Protected route to get the logged-in user's profile
router.get('/me', auth, async (req, res) => {
    // Assuming auth middleware adds the user to req.user
    res.send(req.user);
});

// Protected route to update the logged-in user's profile
router.patch('/me', auth, userController.updateUser);

// Protected route to delete the logged-in user's account
router.delete('/me', auth, userController.deleteUser);



// ADMIN or privileged routes (Should also have some authorization middleware to check for admin privileges)
// Route to get all users - Consider protecting this route and checking if the user has admin privileges
router.get('/', auth, userController.getAllUsers);

// Route to get a single user by ID - Consider if you need to protect or restrict this
router.get('/:id', auth, userController.getUserById);

// Updating and deleting by ID directly could be sensitive operations and might need admin privileges
// Route to update a user by ID - Consider protecting this and checking for admin privileges
router.patch('/:id', auth, userController.updateUser);

// Route to delete a user by ID - Consider protecting this and checking for admin privileges
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;