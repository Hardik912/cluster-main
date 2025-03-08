import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

function VLogin({ setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const did = searchParams.get('did');
    const authToken = searchParams.get('authToken');

    if (did && authToken) {
      setUser({ did, authToken });
      navigate('/dashboard');
    }
  }, [location, setUser, navigate]);

  const connectWithVerida = () => {
    const redirectUrl = encodeURIComponent(window.location.origin);
    const authUrl = `https://app.verida.ai/auth?scopes=api%3Ads-query&scopes=api%3Allm-agent-prompt&scopes=api%3Asearch-universal&scopes=ds%3Asocial-email&scopes=api%3Asearch-chat-threads&scopes=api%3Asearch-ds&scopes=api%3Allm-profile-prompt&scopes=ds%3Ar%3Asocial-chat-message&scopes=ds%3Ar%3Asocial-chat-group&redirectUrl=${redirectUrl}&appDID=did%3Avda%3Amainnet%3A0x87AE6A302aBf187298FC1Fa02A48cFD9EAd2818D`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="">
      <div className="">
      
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center" onClick={connectWithVerida}>
          
          Connect with Verida
        </button>
        
      </div>
    </div>
  );
}

VLogin.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default VLogin;
