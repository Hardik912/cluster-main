import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const Login = () => {
  const { login, authenticated, user } = usePrivy();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated && user) {
      const username = user?.twitter?.username || "guest";
      const address = user?.wallet?.address || "null";
      const privyId = user?.privyId || "null";

      console.log("Redirecting to:", `/dashboard/${privyId}/${username}/${address}`);
      navigate(`/dashboard/${privyId}/${username}/${address}`);
    }
  }, [authenticated, user, navigate]);

  return (
    <div className="relative flex items-center justify-center min-h-screen text-white overflow-hidden">
      {/* Background Image with Metaverse Theme */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.webp')" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-opacity-50 bg-black opacity-60 "></div>
      </div>

      {/* Animated NFT Card */}
      <motion.div
  className="absolute left-52 top-82 transform -translate-y-1/2"
  animate={{
    rotateY: [0, 180, 360], // Full horizontal flip
    x: [0, 5, -5, 0], // Slight horizontal movement for realism
    y: [0, -5, 5, -5, 0], // Floating effect
  }}
  transition={{
    duration: 6, // Slow and smooth full rotation
    repeat: Infinity, // Infinite loop
    ease: "linear", // Constant speed
  }}
  style={{ transformStyle: "preserve-3d" }} // Enables 3D effect
>
  <img
    src="/nft.png"
    alt="NFT Card"
    className=" w-60 h-[320px] rounded-xl shadow-2xl border-4 border-cyan-400 bg-opacity-80 backdrop-blur-md"
  />
</motion.div>


      {/* Funky & Taller Login Form */}
      <motion.div
  className="relative z-10 left-40 bg-black bg-opacity-50 backdrop-blur-2xl shadow-2xl rounded-xl p-10 w-96 h-[440px] border border-cyan-400 hover:border-pink-500 transition-all duration-500 ease-in-out ml-20"
  animate={{
    scale: [1, 1.02, 1],
    boxShadow: [
      "0px 0px 15px rgba(0, 255, 255, 0.5)",
      "0px 0px 25px rgba(255, 105, 180, 0.6)",
      "0px 0px 15px rgba(0, 255, 255, 0.5)",
    ],
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  {/* Title with a More Cyberpunk Feel */}
  <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-5">
    Cluster Protocol
  </h2>

  {/* Description Text */}
  <p className=" mt-8 mb-5 text-gray-300 tracking-wide font-light text-sm">
    Your Gateway to <span className="text-cyan-400">Metaverse</span> Score Checking
  </p>

  {/* Funky Styled Input */}
  <input
    type="text"
    placeholder="Enter your Email Address"
    className="w-full px-4 py-3 mb-8 rounded-lg bg-gray-900 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm"
  />

  {/* Glowing Animated Button */}
  <motion.button
    onClick={login}
    className=" left-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg w-full font-medium shadow-lg hover:shadow-orange-400 transition-all transform hover:scale-105"
    whileHover={{ scale: 1.05 }}
  >
    🚀 Create your Account
  </motion.button>

  {/* Terms & Conditions */}
  <p className="mt-5 text-xs text-gray-500">
    By signing in you agree to the{" "}
    <span className="text-cyan-400 cursor-pointer hover:underline">
      Terms and Conditions
    </span>
  </p>
</motion.div>

    </div>
  );
};

export default Login;
