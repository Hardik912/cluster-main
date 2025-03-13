const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
    privyId: { type: String, required: true, unique: true },
    username: { type: String, default: null },
    twitterScore: { type: Number, default: 0 },
    telegramScore: { type: Number, default: 0 },  // ✅ Added Telegram Score
    totalScore: { type: Number, default: 0 }, // ✅ Now includes Twitter + Wallet + Telegram scores
    wallets: [
        {
            walletAddress: { type: String, required: true },
            score: { type: Number, required: true, default: 10 }
        }
    ],
    badges: [{ type: String ,default: [] }] // ✅ Added badges array for earned achievements
});

module.exports = mongoose.model("Score", ScoreSchema);
