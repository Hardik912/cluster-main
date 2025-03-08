import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function VDashboard({ user }) {
  const [fomoData, setFomoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFOMOscore = async () => {
      try {
        setLoading(true);

        console.log("User authentication data:", {
          did: user.did,
          authToken: user.authToken?.substring(0, 10) + "...",
          hasTokenData: !!user.tokenData,
        });

        if (!user.authToken) {
          setError(
            "Missing Verida authentication token. Please try reconnecting with Verida."
          );
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/VeridaApi/score`,
          {
            did: user.did,
            authToken: user.authToken,
          }
        );

        if (response.data.did && (!user.did || user.did === "unknown")) {
          console.log(`Server retrieved DID: ${response.data.did}`);
        }

        console.log("Received FOMO score data:", response.data);
        setFomoData(response.data);
      } catch (err) {
        console.error("Error fetching FOMOscore:", err);

        if (err.response?.data?.error === "Invalid DID") {
          setError("Invalid Verida DID. Please try reconnecting with Verida.");
        } else {
          setError(
            err.response?.data?.message ||
              "Failed to calculate your FOMOscore. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && user.did && user.authToken) {
      fetchFOMOscore();
    } else {
      setError("Missing authentication information. Please log in again.");
      setLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    navigate("/");
    window.location.reload();
  };

  const getScoreCategory = (score) => {
    if (score < 10)
      return {
        category: "Low FOMO",
        description: "You're quite content with missing out. Kudos!",
      };
    if (score < 50)
      return {
        category: "Moderate FOMO",
        description: "You're occasionally worried about missing the action.",
      };
    if (score < 100)
      return {
        category: "High FOMO",
        description: "You're often concerned about missing important events.",
      };
    return {
      category: "Extreme FOMO",
      description: "You can't stand the thought of missing anything!",
    };
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Calculating your FOMOscore...</h2>
          <div className="mt-4 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    const isDIDError = error.includes("DID") || error.includes("Verida");

    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-red-800 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold">Oops! Something went wrong</h2>
          <p className="mt-2">{error}</p>

          {isDIDError ? (
            <>
              <p className="text-sm mt-2">
                We couldn't retrieve your Verida identity. Please try
                reconnecting.
              </p>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={handleLogout}
              >
                Reconnect with Verida
              </button>
            </>
          ) : (
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={handleLogout}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const scoreInfo = fomoData ? getScoreCategory(fomoData.score) : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center border border-gray-700">
        <h2 className="text-2xl font-bold text-green-400">Your FOMOscore</h2>

        <div className="mt-4">
          <p className="text-6xl font-extrabold">{fomoData.score}</p>
          <p className="text-lg text-yellow-400 font-semibold">
            {scoreInfo.category}
          </p>
          <p className="text-sm mt-2 text-gray-400">{scoreInfo.description}</p>
        </div>

        <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-gray-300">
            Verida DID: <span className="font-bold">{user.did}</span>
          </p>
        </div>

        <button
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

VDashboard.propTypes = {
  user: PropTypes.shape({
    did: PropTypes.string.isRequired,
    authToken: PropTypes.string.isRequired,
  }).isRequired,
};

export default VDashboard;
