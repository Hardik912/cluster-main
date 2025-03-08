import { usePrivy } from "@privy-io/react-auth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";; // Import Redux action
import axios from "axios"; // ✅ Import Axios
import VDashboard from '../Verida/VDashboard'
import TwitterAuth from "../Home/TwitterAuth";
import WalletConnect from "../Home/WalletConnect";
import DownloadButton from "../Home/DownloadButton"; // Import Download Button
import VLogin from "../Verida/VLogin";

const Dashboard = () => {
  const { logout, user } = usePrivy();
  const navigate = useNavigate();
  const { username, address } = useParams();
  const [veridaUser, setVeridaUser] = useState(null);

  // ✅ Get global score from Redux

  const [title, setTitle] = useState("ALL ROUNDOOR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let [score, setScore] = useState(0);

  // ✅ Extract Privy ID
  const privyID = user?.id || "guest";
  
  useEffect(() => {
    if (privyID) {
        fetchTotalScore(privyID);
    }
}, [privyID]);

  // ✅ Fetch score on component mount & when Twitter login happens
  useEffect(() => {
    const userNameFromPrivy = user?.twitter?.username || privyID;
    const walletAddressFromPrivy = user?.wallet?.address || "null";

    if (!username || !address) {
      navigate(`/dashboard/${userNameFromPrivy}/${walletAddressFromPrivy}`);
    } else {
      fetchScore(privyID, username, address);
    }
  }, [username, address, user.twitter]); // ✅ Refetch when user logs in via Twitter

  const fetchTotalScore = async (privyID) => {
    setLoading(true);
    setError("");

    try {
        const response = await axios.get(`http://localhost:5000/api/score/total-score/${privyID}`);
        const data = response.data;
        console.log("✅ Total Score Fetched:", data.totalScore);

        setScore(data.totalScore);
    } catch (err) {
        console.error("❌ Error fetching total score:", err);
        setError(err.response?.data?.error || "Failed to fetch total score");
    } finally {
        setLoading(false);
    }
};

  // ✅ Function to Fetch Score from Backend using Axios
  const fetchScore = async (privyID, username, address) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/score/get-score/${privyID}/${username}/${address}`
      );

      const data = response.data;
      console.log("✅ Fetched Score:", data.totalScore); // ✅ Log the score
     
      setScore(data.totalScore)
      // ✅ Store updated score in Redux
    } catch (err) {
      console.error("❌ Error fetching score:", err);
      setError(err.response?.data?.error || "Failed to fetch score");
    } finally {
      setLoading(false);
    }
  };
  const updateTitle = (totalScore) => {
    let newTitle = "ALL ROUNDOOR";
    if (totalScore >= 90) newTitle = "ALPHA TRADOOR";
    else if (totalScore >= 70) newTitle = "NFT EXPLOROOR";
    else if (totalScore >= 50) newTitle = "DAO DIPLOMAT";
    else if (totalScore >= 30) newTitle = "COMMUNITY ANALYST";

    setTitle(newTitle);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setScore(0);
    setTitle("ALL ROUNDOOR"); // ✅ Reset title on logout
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md p-4 flex items-center justify-between px-8">
        <h1 className="text-xl font-bold text-gray-300">Cluster Protocol</h1>
        <button className="text-gray-400 hover:text-white transition">Home</button>
        <div className="flex items-center space-x-4">
          <p className="text-gray-300">{username || "Guest"}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Score Display */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-2xl text-center border border-gray-700">
          <h2 className="text-4xl font-bold text-green-400 mb-6">Your Score</h2>

          {loading ? (
            <p className="text-gray-400 mb-6">Calculating...</p>
          ) : (
            <div className="mb-6">
              <p className="text-6xl font-extrabold text-white">{score}</p>
              <p className="text-xl text-yellow-400 mt-2 font-semibold">{title}</p> 
            </div>
          )}

          {/* Download & Share Score Section */}
          <div className="mt-6 bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-md">
            <DownloadButton score={score} />
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}

          <main className="flex flex-1 items-center justify-center p-8">
        <div className="bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-2xl text-center border border-gray-700">
          {veridaUser ? (
            // If authenticated, show Verida Dashboard
            <VDashboard user={veridaUser} />
          ) : (
            // Otherwise, show Verida Login
            <VLogin setUser={setVeridaUser} />
          )}
        </div>
      </main>


          {/* If no Twitter is Connected, Show Twitter Auth */}
          {!user.twitter && <TwitterAuth />}
          <WalletConnect />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
