const router = require('express').Router();
const User = require('../user');
const Joi = require('joi');
const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
const logError = (req, res, err) => {
    console.error(`Error: ${req.method} ${req.originalUrl} - ${err}`);
    res.status(500).json(err);
};

router.get('/', async (req, res) => {
    try {
        console.log("GET /api/users - Fetching all users");
        const users = await User.find().populate('thoughts friends');
        console.log("GET /api/users - Users fetched successfully");
        res.json(users);
    } catch (err) {
        logError(req, res, err);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        console.log(`GET /api/users/${req.params.userId} - Fetching user by id: ${req.params.userId}`);
        const user = await User.findById(req.params.userId).populate('thoughts friends');
        console.log(`GET /api/users/${req.params.userId} - User fetched successfully`);
        res.json(user || { message: 'User not found' });
    } catch (err) {
        logError(req, res, err);
    }
});

router.post('/', async (req, res) => {
    try {
        console.log("POST /api/users - Creating a new user");
        const { error } = userSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const user = await User.create(req.body);
        console.log("POST /api/users - User created successfully");
        res.status(201).json(user);
    } catch (err) {
        logError(req, res, err);
    }
});

router.put('/:userId', async (req, res) => {
    try {
        console.log(`PUT /api/users/${req.params.userId} - Updating user by id: ${req.params.userId}`);
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        console.log(`PUT /api/users/${req.params.userId} - User updated successfully`);
        res.json(updatedUser || { message: 'User not found' });
    } catch (err) {
        logError(req, res, err);
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        console.log(`DELETE /api/users/${req.params.userId} - Deleting user by id: ${req.params.userId}`);
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        console.log(`DELETE /api/users/${req.params.userId} - User deleted successfully`);
        res.json(deletedUser || { message: 'User not found' });
    } catch (err) {
        logError(req, res, err);
    }
});

router.post('/:userId/friends', async (req, res) => {
    try {
        console.log(`POST /api/users/${req.params.userId}/friends - Adding friend to user id: ${req.params.userId}`);
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const { friendId } = req.body;
        if (!friendId) return res.status(400).json({ message: 'FriendId is required' });
        if (user.friends.includes(friendId)) return res.status(400).json({ message: 'User is already a friend' });
        user.friends.push(friendId);
        await user.save();
        console.log(`POST /api/users/${req.params.userId}/friends - Friend added successfully`);
        res.status(201).json(user);
    } catch (err) {
        logError(req, res, err);
    }
});

router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        console.log(`DELETE /api/users/${req.params.userId}/friends/${req.params.friendId} - Removing friend from user id: ${req.params.userId}`);
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const { friendId } = req.params;
        if (!user.friends.includes(friendId)) return res.status(400).json({ message: 'User is not a friend' });
        user.friends = user.friends.filter(friend => friend !== friendId);
        await user.save();
        console.log(`DELETE /api/users/${req.params.userId}/friends/${req.params.friendId} - Friend removed successfully`);
        res.json(user);
    } catch (err) {
        logError(req, res, err);
    }
});

module.exports = router;