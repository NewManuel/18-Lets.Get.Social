const { User } = require('../models/index');

module.exports = {
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.userId).populate('thoughts friends');
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json({ message: 'User deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async handleFriendAction(req, res, action) {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const friendId = req.params.friendId;
            if (action === 'add') {
                if (!user.friends.includes(friendId)) {
                    user.friends.push(friendId);
                    await user.save();
                }
            } else if (action === 'remove') {
                user.friends = user.friends.filter(id => id.toString() !== friendId);
                await user.save();
            }

            res.json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async addFriend(req, res) {
        await this.handleFriendAction(req, res, 'add');
    },

    async removeFriend(req, res) {
        await this.handleFriendAction(req, res, 'remove');
    },
};
