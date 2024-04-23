const mongoose = require('mongoose');
const schema = require('./schema');

const thoughtSchema = new mongoose.Schema({
    thoughtText: {
        type: String,
        required: true,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => new Date(createdAtVal).toISOString(),
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [schema], // Embed Reaction schema as an array of subdocuments
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
