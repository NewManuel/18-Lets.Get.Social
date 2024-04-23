const { Thought } = require('../models');

module.exports = {
    // Controller function to handle errors
    errorHandler(res, err) {
        return res.status(500).json({ message: err.message });
    },

    // Controller function to get all thoughts
    async getAllThoughts(req, res) {
        try {
            res.json(await Thought.find());
        } catch (err) {
            this.errorHandler(res, err);
        }
    },

    // Controller function to get a thought by ID
    async getThoughtById(req, res) {
        try {
            const thought = await Thought.findById(req.params.thoughtId);
            thought ? res.json(thought) : res.status(404).json({ message: 'Thought not found' });
        } catch (err) {
            this.errorHandler(res, err);
        }
    },

    // Controller function to create a new thought
    async createThought(req, res) {
        try {
            res.status(201).json(await Thought.create(req.body));
        } catch (err) {
            this.errorHandler(res, err);
        }
    },

    // Controller function to update a thought by ID
    async updateThought(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
            thought ? res.json(thought) : res.status(404).json({ message: 'Thought not found' });
        } catch (err) {
            this.errorHandler(res, err);
        }
    },

    // Controller function to delete a thought by ID
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
            thought ? res.json({ message: 'Thought deleted' }) : res.status(404).json({ message: 'Thought not found' });
        } catch (err) {
            this.errorHandler(res, err);
        }
    },

    // Controller function to create a reaction for a thought
    async createReaction(req, res) {
        try {
            const thought = await Thought.findById(req.params.thoughtId);
            if (!thought) return res.status(404).json({ message: 'Thought not found' });
            thought.reactions.push(req.body);
            res.status(201).json(await thought.save());
        } catch (err) {
            this.errorHandler(res, err);
        }
    },

    // Controller function to delete a reaction for a thought
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findById(req.params.thoughtId);
            if (!thought) return res.status(404).json({ message: 'Thought not found' });
            thought.reactions = thought.reactions.filter(reaction => reaction._id.toString() !== req.params.reactionId);
            res.json(await thought.save());
        } catch (err) {
            this.errorHandler(res, err);
        }
    },
};