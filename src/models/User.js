const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    discordId: {
        type: String,
        required: true,
        unique: true
    },

    username: {
        type: String,
        required: true
    },

    xp: {
        type: Number,
        default: 0
    },

    streak: {
        type: Number,
        default: 1
    },

    totalProgress: {
        type: Number,
        default: 0
    },

    lastProgressDate: {
        type: Date
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);