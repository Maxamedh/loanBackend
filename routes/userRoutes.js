const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const itMiddleware = require('../middleware/itMiddleware');

// @route   GET api/users
// @desc    Get all users
// @access  IT Only
router.get('/', itMiddleware, userController.getAllUsers);

// @route   POST api/users
// @desc    Create user
// @access  IT Only
router.post('/', itMiddleware, userController.createUser);

// @route   PUT api/users/:id
// @desc    Update user
// @access  IT Only
router.put('/:id', itMiddleware, userController.updateUser);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  IT Only
router.delete('/:id', itMiddleware, userController.deleteUser);

// @route   PATCH api/users/:id/toggle-status
// @desc    Toggle user active status
// @access  IT Only
router.patch('/:id/toggle-status', itMiddleware, userController.toggleUserStatus);

module.exports = router;
