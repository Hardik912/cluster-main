import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { usePrivy } from "@privy-io/react-auth";

function Verida() {
  const location = useLocation();
  const { logout, user } = usePrivy();
  const [connected, setConnected] = useState(false);
  const [fomoUser, setFomoUser] = useState(null);
  const [fomoData, setFomoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualDid, setManualDid] = useState('');
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const did = searchParams.get('did');
    const authToken = searchParams.get('authToken');
    const tokenParam = searchParams.get('token');
    const errorParam = searchParams.get('error');
    const errorMessage = searchParams.get('message');

    if (errorParam) {
      console.error('Authentication error:', errorParam, errorMessage);
      setError(errorMessage || 'Failed to authenticate with Verida.');
      return;
    }

    if (user?.id && did && authToken) {
      console.log("✅ Authenticated with Privy & Verida:", {
        privyId: user.id,
        userDid: did,
        authToken: authToken.substring(0, 10) + "...",
      });

      // ✅ Send data to backend for FOMO score
      sendFOMOscore(user.id, did, authToken);
    }

    if (did && authToken) {
      console.log('Authenticated:', { did, authToken: authToken.substring(0, 10) + '...' });
      setFomoUser({ did, authToken });
      
      return;
    }

    if (tokenParam) {
      try {
        const tokenData = JSON.parse(tokenParam);
        console.log('Token data:', tokenData);

        let extractedDid, extractedToken;
        if (tokenData.token) {
          extractedDid = tokenData.token.did;
          extractedToken = tokenData.token._id || tokenData.token;
        } else if (tokenData.did) {
          extractedDid = tokenData.did;
          extractedToken = tokenData._id;
        }

        if (extractedDid && extractedToken) {
          setFomoUser({ did: extractedDid, authToken: extractedToken, tokenData });
        } else {
          setError('Incomplete authentication data.');
        }
      } catch (err) {
        console.error('Error parsing token data:', err);
        setError('Failed to process authentication data.');
      }
    }
  }, [user, location]);

  const sendFOMOscore = async ( userDid, authToken) => {
    try {
      setLoading(true);
      console.log("📤 Sending to backend:", { userDid, authToken });

      const response = await axios.post(
        `http://localhost:5000/api/score/get-score`,
        { userDid, authToken }
      );

      const data = response.data;
      console.log("✅ Backend Response:", data);
      setFomoData(data);
    } catch (error) {
      console.error("❌ Failed to fetch FOMOscore:", error.response?.data || error);
      setError("Failed to calculate your Telegram score.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fomoUser) return;

    const fetchFOMOscore = async () => {
      try {
        setLoading(true);
        console.log('Fetching FOMO score for:', { did: fomoUser.did, authToken: fomoUser.authToken.substring(0, 10) + '...' });

        if (fomoUser.authToken === 'manual-auth-token-for-testing') {
          setTimeout(() => {
            setFomoData({
              score: 7.5,
              did: fomoUser.did,
              data: { groups: 12, messages: 257, keywordMatches: { totalCount: 15, keywords: { 'cluster': 5, 'protocol': 8, 'ai': 2 } } }
            });
            setLoading(false);
          }, 1500);
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/score`,
          { did: fomoUser.did, authToken: fomoUser.authToken }
        );

        console.log('FOMO score received:', response.data);
        setFomoData(response.data);
      } catch (err) {
        console.error('Error fetching FOMOscore:', err);
        setError(err.response?.data?.message || 'Failed to calculate your FOMOscore.');
      } finally {
        setLoading(false);
      }
    };

    fetchFOMOscore();
  }, [fomoUser]);

  const connectWithVerida = () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const callbackUrl = `${backendUrl}/auth/callback`;
    setTimeout(() => {
      setConnected(true);
    }, 3000); 
    const authUrl = `https://app.verida.ai/auth?scopes=api%3Ads-query&scopes=api%3Asearch-universal&scopes=ds%3Asocial-email&scopes=api%3Asearch-ds&scopes=api%3Asearch-chat-threads&scopes=ds%3Ar%3Asocial-chat-group&scopes=ds%3Ar%3Asocial-chat-message&redirectUrl=${encodeURIComponent(callbackUrl)}&appDID=did%3Avda%3Amainnet%3A0x87AE6A302aBf187298FC1Fa02A48cFD9EAd2818D`;

    console.log('Redirecting to Verida:', authUrl);
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    setFomoUser(null);
    setFomoData(null);
    setError(null);
    setLoading(false);
    setConnected(false)
    window.location.href = '/';
  };

  const handleManualLogin = () => {
    if (manualDid) {
      setFomoUser({ did: manualDid, authToken: 'manual-auth-token-for-testing' });
    } else {
      setError('Please enter a valid DID');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Calculating your FOMOscore...</h2>
          <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-500">Oops! Something went wrong</h2>
          <p className="mt-2 text-red-700">{error}</p>
          <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={handleLogout}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (fomoUser && fomoData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold">Your FOMOscore</h1>
          <p className="mt-2 text-gray-600">Verida DID: <span className="font-mono">{fomoUser.did}</span></p>
          <div className="mt-4 flex justify-center">
            <div className="w-24 h-24 flex items-center justify-center bg-blue-500 text-white text-3xl font-bold rounded-full">
              {fomoData.score} / 10
            </div>
          </div>
          <button className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-20 bg-gradient-to-b from-gray-900 to-black bg-opacity-60 backdrop-blur-xl shadow-lg rounded-xl p-4 w-[230px] mt-4 border border-cyan-400 transition-all duration-500 ease-in-out flex flex-col items-center">
  {connected ? (
    <div className="text-xl font-bold text-cyan-400">
      Verida Connected
    </div>
  ) : (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
      onClick={connectWithVerida}
    >
      Connect with Verida
    </button>
  )}
</div>

  );
}

export default Verida;