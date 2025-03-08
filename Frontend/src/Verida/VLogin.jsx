import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function VLogin({ setUser }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    console.log("Full URL Parameters:", location.search); // 🔍 Debugging
  
    const did = searchParams.get("did");
    const authToken = searchParams.get("authToken");
    const tokenParam = searchParams.get("token");
    const errorParam = searchParams.get("error");
    const errorMessage = searchParams.get("message");
  
    console.log("AuthToken from URL:", authToken); // 🔍 Debugging
  
    if (errorParam) {
      console.error("Authentication error:", errorParam, errorMessage);
      setError(errorMessage || "Failed to authenticate with Verida. Please try again.");
      return;
    }
  
    if (tokenParam) {
      try {
        const tokenData = JSON.parse(tokenParam);
        console.log("Authentication successful from token data:", tokenData);
        setUser({
          did: tokenData.token.did,
          authToken: tokenData.token._id,
          tokenData: tokenData.token,
        });
        return;
      } catch (err) {
        console.error("Error parsing token data:", err);
      }
    }
  
    if (did && authToken) {
      console.log("Authentication successful from URL params:", { did, authToken });
      setUser({ did, authToken });
    }
  }, [, setUser,]);
  

  const connectWithVerida = () => {
    const callbackUrl = `http://localhost:5000/VeridaAuth/callback`;
    const authUrl = `https://app.verida.ai/auth?scopes=api%3Ads-query&scopes=api%3Asearch-universal&scopes=ds%3Asocial-email&scopes=api%3Asearch-ds&scopes=api%3Asearch-chat-threads&scopes=ds%3Ar%3Asocial-chat-group&scopes=ds%3Ar%3Asocial-chat-message&redirectUrl=${encodeURIComponent(callbackUrl)}&appDID=did%3Avda%3Amainnet%3A0x87AE6A302aBf187298FC1Fa02A48cFD9EAd2818D`;

    console.log("Redirecting to Verida auth:", authUrl);
    window.location.href = authUrl;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center border border-gray-700">
        <h1 className="text-3xl font-bold text-green-400">FomoScore</h1>
        <p className="text-gray-300 mt-2">Score based on your Telegram activity</p>

        <button
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md flex items-center justify-center w-full"
          onClick={connectWithVerida}
        >
          <img src="/Connect-Verida.png" alt="Connect with Verida" className="h-6 w-6 mr-2" />
          Connect with Verida
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

VLogin.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default VLogin;
