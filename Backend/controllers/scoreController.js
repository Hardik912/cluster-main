const { getUserDetails } = require("./twitterController.js");
const { getWalletDetails } = require("./BlockchainController.js");
const Score = require("../models/Score");

// ✅ Function to Handle Score Updates (Twitter + Wallets)
async function calculateScore(req, res) {
    try {
        console.log("🔍 Request Received:", req.method === "POST" ? req.body : req.params);

        let { privyId, username, address } = req.params;

        // ✅ Handle POST request (req.body) if no params are provided
        if (req.method === "POST") {
            if (!privyId && req.body.privyId) privyId = req.body.privyId;
            if (!username && req.body.userId) username = req.body.userId;
            if (!address && req.body.walletAddress) address = req.body.walletAddress;
        }

        // ✅ Ensure at least a Privy ID is provided
        if (!privyId) {
            return res.status(400).json({ error: "Provide a Privy ID" });
        }

        

        console.log(`📢 Fetching data for: PrivyID(${privyId}), Twitter(${username || "None"}), Wallet(${address || "None"})`);

        let userData = null;
        let walletData = {}; // ✅ Default to empty wallet data

        // ✅ If username is provided, update Twitter score
        if (username) {
            try {
                userData = await getUserDetails(username);
                await updateTwitterScore(privyId, userData);
            } catch (err) {
                console.error("❌ Error fetching Twitter user data:", err);
            }
        }

        // ✅ If wallet address is provided, update wallet score
        if (address) {
            try {
                walletData = await getWalletDetails(address);
                await updateWalletScore(privyId, address, walletData);
            } catch (err) {
                console.error("❌ Error fetching wallet data:", err);
            }
        }

        // ✅ Get updated total score
        const totalScore = await calculateTotalScore(privyId);

        return res.json({ totalScore });

    } catch (error) {
        console.error("❌ Error calculating score:", error);
        return res.status(500).json({ error: "Server Error" });
    }
}

// ✅ Function to Update Twitter Score in MongoDB
async function updateTwitterScore(privyId, userData) {
    const twitterScore = generateTwitterScore(userData);

    let userEntry = await Score.findOne({ privyId });

    if (!userEntry) {
        userEntry = new Score({
            privyId,
            twitterScore,
            wallets: [],
            totalScore: twitterScore
        });
    } else {
        userEntry.twitterScore = twitterScore;
    }

    await userEntry.save();
}

// ✅ Function to Add a Wallet & Update Score in MongoDB
async function updateWalletScore(privyId, address, walletData) {
    const { score } = generateWalletScore(walletData);

    let userEntry = await Score.findOne({ privyId });

    if (!userEntry) {
        userEntry = new Score({
            privyId,
            wallets: [{ walletAddress: address, score }],
            totalScore: score
        });
    } else {
        // ✅ Check if wallet already exists for this user
        const existingWallet = userEntry.wallets.find(w => w.walletAddress === address);

        if (!existingWallet) {
            userEntry.wallets.push({ walletAddress: address, score });
        } else {
            console.log(`⚠️ Wallet ${address} already exists for user ${privyId}, skipping duplicate entry.`);
            return;
        }
    }

    await userEntry.save();
}

// ✅ Function to Calculate Total Score (Twitter + Wallets)
async function calculateTotalScore(privyId) {
    const userEntry = await Score.findOne({ privyId });

    if (!userEntry) return 0;

    const walletTotal = userEntry.wallets.reduce((acc, curr) => acc + curr.score, 0);
    userEntry.totalScore = userEntry.twitterScore + walletTotal;

    await userEntry.save();

    return userEntry.totalScore;
}
async function getTotalScore(req, res) {
    try {
        const { privyId } = req.params;

        if (!privyId) {
            return res.status(400).json({ error: "Privy ID is required" });
        }

        console.log(`📢 Fetching total score for PrivyID: ${privyId}`);

        const userEntry = await Score.findOne({ privyId });

        if (!userEntry) {
            console.log(`⚠️ No score found for PrivyID: ${privyId}`);
            return res.json({ totalScore: 0 });
        }

        console.log(`✅ Total Score for ${privyId}: ${userEntry.totalScore}`);
        return res.json({ totalScore: userEntry.totalScore });

    } catch (error) {
        console.error("❌ Error fetching total score:", error);
        return res.status(500).json({ error: "Server Error" });
    }
}
// ✅ Generate Twitter Score Based on User Data
function generateTwitterScore(userData) {
    let score = 0;

    if (userData) {
        const user = userData?.data?.user?.result || {};
        const followers = user.followers_count || 0;
        score += followers > 10000000 ? 40 : followers > 1000000 ? 30 : followers > 100000 ? 20 : 10;

        const engagement = (user.favourites_count || 0) + (user.media_count || 0) + (user.listed_count || 0);
        score += engagement > 50000 ? 10 : engagement > 10000 ? 5 : 0;

        if (user.is_blue_verified) score += 5;
        score = Math.min(score, 40);
    }

    return score;
}

// ✅ Generate Wallet Score Based on Wallet Data
function generateWalletScore(walletData) {
    let cryptoScore = 0;
    let nftScore = 0;

    const activeChains = walletData?.activeChains?.length || 0;
    cryptoScore += activeChains > 1 ? 20 : activeChains === 1 ? 10 : 0;

    if ((walletData?.nativeBalance || 0) > 1) cryptoScore += 10;
    if ((walletData?.defiPositionsSummary?.length || 0) > 0) cryptoScore += 10;

    nftScore = (walletData?.walletNFTs?.length || 0) > 0 ? 20 : 0;

    return { score: Math.max(cryptoScore + nftScore, 10) };
}

module.exports = { calculateScore,getTotalScore };
