import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function VDashboard({ user }) {
  const [walletAddress, setWalletAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/VeridaApi/get-wallet`,
          {
            did: user.did,
            authToken: user.authToken
          }
        );
        setWalletAddress(response.data.walletAddress);
      } catch (err) {
        console.error('Error fetching wallet address:', err);
      }
    };

    if (user) {
      fetchWalletAddress();
    }
  }, [user]);

  const handleLogout = () => {
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full text-center border border-gray-700">
        <h1 className="text-2xl font-bold text-green-400">User Dashboard</h1>

        {/* ✅ Show Username */}
        <div className="mt-4 text-lg">
          <span className="text-gray-400">Username:</span>
          <span className="font-semibold ml-2">{user}</span>
        </div>

        {/* ✅ Show Wallet Address */}
        <div className="mt-2 text-lg">
          <span className="text-gray-400">Wallet Address:</span>
          <span className="font-semibold ml-2">
            {walletAddress ? walletAddress : "Fetching..."}
          </span>
        </div>

        {/* ✅ Logout Button */}
        <button
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

VDashboard.propTypes = {
  user: PropTypes.shape({
    did: PropTypes.string.isRequired,
    authToken: PropTypes.string.isRequired
  }).isRequired
};

export default VDashboard;
