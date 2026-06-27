const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({

    discordId: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    workDone: {
        type: String,
        required: true
    },

    hoursWorked: {
        type: Number,
        required: true
    },

    githubLink: {
        type: String
    },

    tomorrowGoal: {
        type: String,
        required: true
    },
    xpBreakdown: {
        base: Number,
        description: Number,
        github: Number,
        hours: Number,
        screenshot: Number,
        streak: Number,
        total: Number
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Progress", progressSchema);