import { useState } from "react";

function OAuthWizard() {
  const [step, setStep] = useState(1);

  // Step 1: App Info
  const [appName, setAppName] = useState("");
  const [description, setDescription] = useState("");
  const [apmID, setApmID] = useState("");
  const [jiraTicket, setJiraTicket] = useState("");
  const [jiraError, setJiraError] = useState("");

  // Step 2: Client ID
  const [clientId, setClientId] = useState("");
  const [clientIdError, setClientIdError] = useState("");

  // Step 3: SPA Detection
  const [isSPA, setIsSPA] = useState(null);
  const [usePKCE, setUsePKCE] = useState(true);

  // Placeholder for future steps
  const [clientSecret, setClientSecret] = useState("");
  const [redirectURIs, setRedirectURIs] = useState("");
  const [needsADGroups, setNeedsADGroups] = useState(null);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const validateJiraURL = (url) => {
    const pattern = /^https:\/\/[a-zA-Z0-9.-]+\/browse\/[A-Z]+-\d+$/;
    return pattern.test(url.trim());
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        OAuth2 / OIDC Integration Wizard
      </h2>

      {step === 1 && (
        <>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Application Name <span className="text-red-600">*</span>
              <span className="ml-1 text-blue-500 cursor-help" title="The name of your application that will be integrated.">❓</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description <span className="text-red-600">*</span>
              <span className="ml-1 text-blue-500 cursor-help" title="A brief description of what your application does or its purpose.">❓</span>
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              APM ID <span className="text-red-600">*</span>
              <span className="ml-1 text-blue-500 cursor-help" title="Internal tracking ID used for application inventory.">❓</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              value={apmID}
              onChange={(e) => setApmID(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Jira Ticket URL <span className="text-red-600">*</span>
              <span className="ml-1 text-blue-500 cursor-help" title="Link to your Jira ticket (e.g. https://jira.company.com/browse/ABC-123)">❓</span>
            </label>
            <input
              type="url"
              className="w-full px-4 py-2 border rounded"
              value={jiraTicket}
              onChange={(e) => {
                setJiraTicket(e.target.value);
                setJiraError("");
              }}
            />
            {jiraError && <p className="text-sm text-red-600 mt-1">{jiraError}</p>}
          </div>

          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => {
                if (!appName || !description || !apmID || !jiraTicket) {
                  setJiraError("Please fill out all required fields.");
                  return;
                }
                if (!validateJiraURL(jiraTicket)) {
                  setJiraError("Please enter a valid Jira URL (e.g. https://jira.company.com/browse/ABC-123)");
                  return;
                }
                nextStep();
              }}
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Desired Client ID
            <span className="ml-1 text-blue-500 cursor-help" title="This ID must be unique. It will be used in PingFederate.">❓</span>
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              setClientIdError("");
            }}
            className="w-full px-4 py-2 border rounded mb-2"
            placeholder="e.g., my-app-client-id"
          />
          {clientIdError && <p className="text-red-600 text-sm mb-2">{clientIdError}</p>}
          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={prevStep}>Back</button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        </>
      )}


      {step === 3 && (
        <>
          <p className="mb-4">Is your application a Single Page Application (SPA)?</p>
          <div className="space-x-4">
            <button
              className={`px-4 py-2 rounded ${isSPA === true ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => {
                setIsSPA(true);
                setUsePKCE(true); // enforce PKCE for SPAs
              }}
            >
              Yes
            </button>
            <button
              className={`px-4 py-2 rounded ${isSPA === false ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setIsSPA(false)}
            >
              No
            </button>
          </div>

          <div className="mt-6 flex justify-between">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={prevStep}>
              Back
            </button>
            {isSPA !== null && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={nextStep}>
                Next
              </button>
            )}
          </div>
        </>
      )}

      {step === 4 && isSPA === false && (
        <>
          <p className="mb-4">How will your app authenticate?</p>
          <div className="space-x-4">
            <button
              className={`px-4 py-2 rounded ${usePKCE ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setUsePKCE(true)}
            >
              PKCE (Recommended)
            </button>
            <button
              className={`px-4 py-2 rounded ${!usePKCE ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setUsePKCE(false)}
            >
              Client Secret
            </button>
          </div>
          {!usePKCE && (
            <input
              type="text"
              className="w-full px-4 py-2 border rounded mt-4"
              placeholder="Enter client secret"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
          )}
          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={prevStep}>Back</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={nextStep}>Next</button>
          </div>
        </>
      )}
      {step === 5 && (
        <>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Redirect URIs (maximum 10, one per line)
          </label>
          <textarea
            className="w-full px-4 py-2 border rounded"
            placeholder={"https://yourapp.com/callback\nhttp://localhost:3000"}
            rows={5}
            value={redirectURIs}
            onChange={(e) => setRedirectURIs(e.target.value)}
          />
          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={prevStep}>Back</button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => {
                const uris = redirectURIs
                  .split("\n")
                  .map((uri) => uri.trim())
                  .filter(Boolean);

                if (uris.length > 10) {
                  alert("You can enter up to 10 URIs only.");
                  return;
                }

                if (uris.some((uri) => uri.includes("*"))) {
                  alert("Wildcards (*) are not allowed in redirect URIs.");
                  return;
                }

                nextStep();
              }}
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 6 && (
        <>
          <p className="mb-4">Do you need AD groups returned in the ID token?</p>
          <div className="space-x-4">
            <button
              className={`px-4 py-2 rounded ${needsADGroups === true ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setNeedsADGroups(true)}
            >
              Yes
            </button>
            <button
              className={`px-4 py-2 rounded ${needsADGroups === false ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setNeedsADGroups(false)}
            >
              No
            </button>
          </div>
          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={prevStep}>Back</button>
            {needsADGroups !== null && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={nextStep}>
                Next
              </button>
            )}
          </div>
        </>
      )}
      {step === 7 && (
        <>
          <h3 className="text-xl font-bold mb-4">Review Your Submission</h3>
          <ul className="text-sm text-gray-800 space-y-2">
            <li><strong>App Name:</strong> {appName}</li>
            <li><strong>Description:</strong> {description}</li>
            <li><strong>APM ID:</strong> {apmID}</li>
            <li><strong>Jira Ticket:</strong> {jiraTicket}</li>
            <li><strong>Client ID:</strong> {clientId}</li>
            <li><strong>SPA:</strong> {isSPA ? "Yes" : "No"}</li>
            <li><strong>Auth Method:</strong> {usePKCE ? "PKCE" : "Client Secret"}</li>
            {!usePKCE && <li><strong>Client Secret:</strong> {clientSecret}</li>}
            <li>
              <strong>Redirect URIs:</strong>
              <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded border">
                {redirectURIs}
              </pre>
            </li>
            <li><strong>AD Groups in ID Token:</strong> {needsADGroups ? "Yes" : "No"}</li>
          </ul>

          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={prevStep}>
              Back
            </button>
           <button
  className="px-4 py-2 bg-green-600 text-white rounded"
  onClick={async () => {
    const payload = {
      appName: appName,
      description: description,
      apmID: apmID,
      jiraTicket: jiraTicket,
      clientId: clientId,
      isSPA,
      usePKCE,
      needsADGroups,
      redirectURIs: redirectURIs.split("\\n").map(uri => uri.trim()),
      userEmail: "testuser@example.com" // TODO: replace with real user from auth
    };

    try {
      const res = await fetch("http://localhost:5000/api/integrations/oauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      alert("✅ Integration submitted! ID: " + data.id);
      // Optionally reset form or redirect
    } catch (err) {
      console.error("Submission error:", err);
      alert("❌ Submission failed. Please try again.");
    }
  }}
>
  Submit
</button>

          </div>
        </>
      )}
    </div>
  );
}

export default OAuthWizard;
