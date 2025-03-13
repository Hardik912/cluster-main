import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { logout } = usePrivy();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [finalScore] = useState(Math.floor(Math.random() * 9) + 100); // Random 4-digit score

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setScore(Math.floor(Math.random() * 9999)); // Continuously change score
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setScore(finalScore); // Set final score after 3 seconds
    }, 3000);

    return () => clearInterval(interval);
  }, [finalScore]);

  return (
    <div className="relative flex items-center justify-center min-h-screen text-white overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.webp')" }}
      >
        <div className="absolute inset-0 bg-opacity-80 bg-black opacity-60"></div>
      </div>
      <button
       
        className="absolute top-6 right-36 bg-orange-700 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-orange-800 transition"
      >
        Leaderboard
      </button>
      <button
        onClick={handleLogout}
        className="absolute top-6 right-8 bg-red-600 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-red-700 transition"
      >
        Logout
      </button>

      {/* Score Card Container */}
      <motion.div
        className="relative z-10 bg-gradient-to-b from-gray-900 to-black bg-opacity-70 backdrop-blur-lg shadow-xl rounded-xl p-10 w-[400px] border border-cyan-400 hover:border-orange-500 transition-all duration-500 ease-in-out flex flex-col items-center justify-center"
        animate={{
          scale: [1, 1.02, 1],
          boxShadow: [
            "0px 0px 15px rgba(0, 255, 255, 0.5)",
            "0px 0px 25px rgba(255, 105, 180, 0.6)",
            "0px 0px 15px rgba(0, 255, 255, 0.5)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Animated NFT Card Inside Score Card */}
        <motion.div
          className="relative flex items-center justify-center -mt-6"
          animate={{
            rotateY: [0, 180, 360], // Full horizontal flip
            x: [0, 5, -5, 0], // Slight horizontal movement
            y: [0, -5, 5, -5, 0], // Floating effect
          }}
          transition={{
            duration: 8, // Slow and smooth full rotation
            repeat: Infinity, // Infinite loop
            ease: "linear",
          }}
          style={{ transformStyle: "preserve-3d" }} // Enables 3D effect
        >
          <img
            src="/nft.png"
            alt="NFT Card"
            className="w-52 h-[280px] rounded-xl shadow-2xl border-4 border-cyan-400 bg-opacity-80 backdrop-blur-md"
          />
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mt-4">
          YOU ARE <span className="text-orange-500">All Rounder</span>
        </h2>

        {/* Dynamic Score */}
        <motion.div
          className="text-5xl font-bold text-orange-400 tracking-wide mt-4"
          animate={{
            scale: [1, 1.1, 1],
            textShadow: [
              "0px 0px 15px rgba(255, 165, 0, 0.8)",
              "0px 0px 30px rgba(255, 69, 0, 0.8)",
              "0px 0px 15px rgba(255, 165, 0, 0.8)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {score}
        </motion.div>

        <p className="text-gray-400 mt-2 text-sm">Your Total Score</p>

        {/* Mint NFT Button */}
        <motion.button
          className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg w-full font-medium shadow-lg hover:bg-orange-600 transition-all transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
        >
          Share Your Score
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;
