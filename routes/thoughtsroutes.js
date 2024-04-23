const { Router } = require('express');
const Joi = require('joi');
const { Thought, User } = require('../models');
const router = Router();
const thoughtSchema = Joi.object({
    thoughtText: Joi.string().required(),
    username: Joi.string().required(),
    userId: Joi.string().required(),
});
const handleRequest = async (req, res, fn) => {
    try {
        await fn(req, res);
    } catch (err) {
        console.error(`${req.method} ${req.originalUrl} - Error:`, err);
        res.status(500).json(err);
    }
};

router.get('/', async (req, res) => {
    await handleRequest(req, res, async () => {
        console.log("GET /api/thoughts - Fetching all thoughts");
        const thoughts = await Thought.find().populate('reactions');
        console.log("GET /api/thoughts - Thoughts fetched successfully");
        res.json(thoughts);
    });
});

router.get('/:thoughtId', async (req, res) => {
    await handleRequest(req, res, async () => {
        console.log(`GET /api/thoughts/${req.params.thoughtId} - Fetching thought by id: ${req.params.thoughtId}`);
        const thought = await Thought.findById(req.params.thoughtId).populate('reactions');
        console.log(`GET /api/thoughts/${req.params.thoughtId} - Thought fetched successfully`);
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        res.json(thought);
    });
});

router.post('/', async (req, res) => {
    await handleRequest(req, res, async () => {
        console.log("POST /api/thoughts - Creating a new thought");
        const thought = await Thought.create(req.body);
        console.log("POST /api/thoughts - Thought created successfully");
        const user = await User.findByIdAndUpdate(
            req.body.userId,
            { $push: { thoughts: thought._id } },
            { new: true }
        );
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(201).json(thought);
    });
});

router.put('/:thoughtId', async (req, res) => {
    await handleRequest(req, res, async () => {
        console.log(`PUT /api/thoughts/${req.params.thoughtId} - Updating thought by id: ${req.params.thoughtId}`);
        const updatedThought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            req.body,
            { new: true }
        );
        console.log(`PUT /api/thoughts/${req.params.thoughtId} - Thought updated successfully`);
        if (!updatedThought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        res.json(updatedThought);
    });
});

router.delete('/:thoughtId', async (req, res) => {
    await handleRequest(req, res, async () => {
        console.log(`DELETE /api/thoughts/${req.params.thoughtId} - Deleting thought by id: ${req.params.thoughtId}`);
        const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);
        console.log(`DELETE /api/thoughts/${req.params.thoughtId} - Thought deleted successfully`);
        if (!deletedThought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        res.json(deletedThought);
    });
});

router.post('/:thoughtId/reactions', async (req, res) => {
    await handleRequest(req, res, async () => {
        console.log(`POST /api/thoughts/${req.params.thoughtId}/reactions - Adding reaction to thought id: ${req.params.thoughtId}`);
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        thought.reactions.push(req.body);
        const updatedThought = await thought.save();
        console.log(`POST /api/thoughts/${req.params.thoughtId}/reactions - Reaction added successfully`);
        res.status(201).json(updatedThought);
    });
});

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    await handleRequest(req, res, async () => {
        console.log(`DELETE /api/thoughts/${req.params.thoughtId}/reactions/${req.params.reactionId} - Removing reaction with id: ${req.params.reactionId}`);
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        thought.reactions = thought.reactions.filter(
            reaction => reaction.reactionId.toString() !== req.params.reactionId
        );
        const updatedThought = await thought.save();
        console.log(`DELETE /api/thoughts/${req.params.thoughtId}/reactions/${req.params.reactionId} - Reaction removed successfully`);
        res.json(updatedThought);
    });
});

module.exports = router;
