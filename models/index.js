const { User } = require('.');

module.exports = {
    // Get all users
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get a single user by ID
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.userId)
                .populate('thoughts')
                .populate('friends');
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update a user by ID
    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete a user by ID
    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json({ message: 'User deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Add a friend to a user's friend list
    async addFriend(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            if (!user.friends.includes(req.params.friendId)) {
                user.friends.push(req.params.friendId);
                await user.save();
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Remove a friend from a user's friend list
    async removeFriend(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            user.friends = user.friends.filter(friendId => friendId.toString() !== req.params.friendId);
            await user.save();
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};