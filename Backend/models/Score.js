const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
    privyId: { type: String, required: true, unique: true },
    username: { type: String, default: null },
    twitterScore: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 }, // ✅ Stores the sum of Twitter + Wallet scores
    wallets: [
        {
            walletAddress: { type: String, required: true },
            score: { type: Number, required: true, default: 10 }
        }
    ]
});

module.exports = mongoose.model("Score", ScoreSchema);
