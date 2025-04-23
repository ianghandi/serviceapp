import { useNavigate } from "react-router-dom";

function NewIntegration() {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    if (type === "saml") {
      navigate("/wizard/saml");
    } else if (type === "oauth") {
      navigate("/wizard/oauth");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Start a New Integration</h2>
      <p className="text-gray-600 mb-6">
        Choose the integration type you'd like to configure for your application.
      </p>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => handleSelect("saml")}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          SAML Integration
        </button>
        <button
          onClick={() => handleSelect("oauth")}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          OAuth2 / OIDC Integration
        </button>
      </div>
    </div>
  );
}

export default NewIntegration;
