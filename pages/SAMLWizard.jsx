import { useState } from "react";

function SAMLWizard() {
  const [step, setStep] = useState(1);

  const [appName, setAppName] = useState("");
  const [description, setDescription] = useState("");
  const [apmID, setApmID] = useState("");
  const [jiraTicket, setJiraTicket] = useState("");
  const [jiraError, setJiraError] = useState("");

  const [entityId, setEntityId] = useState("");
  const [acsUrl, setAcsUrl] = useState("");
  const [attributes, setAttributes] = useState("");

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const validateJiraURL = (url) => {
    const pattern = /^https:\/\/[a-zA-Z0-9.-]+\/browse\/[A-Z]+-\d+$/;
    return pattern.test(url.trim());
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">SAML Integration Wizard</h2>

      {/* Step 1: App Info */}
      {step === 1 && (
        <>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Application Name <span className="text-red-600">*</span></label>
            <input type="text" className="w-full px-4 py-2 border rounded" value={appName} onChange={(e) => setAppName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Description <span className="text-red-600">*</span></label>
            <textarea className="w-full px-4 py-2 border rounded" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">APM ID <span className="text-red-600">*</span></label>
            <input type="text" className="w-full px-4 py-2 border rounded" value={apmID} onChange={(e) => setApmID(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Jira Ticket URL <span className="text-red-600">*</span></label>
            <input type="url" className="w-full px-4 py-2 border rounded" value={jiraTicket} onChange={(e) => { setJiraTicket(e.target.value); setJiraError(""); }} />
            {jiraError && <p className="text-sm text-red-600 mt-1">{jiraError}</p>}
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-purple-600 text-white rounded"
              onClick={() => {
                if (!appName || !description || !apmID || !jiraTicket) {
                  setJiraError("All fields are required.");
                  return;
                }
                if (!validateJiraURL(jiraTicket)) {
                  setJiraError("Invalid Jira URL format.");
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

      {/* Step 2: Entity ID and ACS URL */}
      {step === 2 && (
        <>
          <label className="block mb-2 text-sm font-medium text-gray-700">Entity ID</label>
          <input type="text" className="w-full px-4 py-2 border rounded mb-4" value={entityId} onChange={(e) => setEntityId(e.target.value)} />
          <label className="block mb-2 text-sm font-medium text-gray-700">ACS URL</label>
          <input type="url" className="w-full px-4 py-2 border rounded mb-4" value={acsUrl} onChange={(e) => setAcsUrl(e.target.value)} />
          <div className="flex justify-between">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={prevStep}>Back</button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={() => {
              if (!entityId || !acsUrl) {
                alert("Entity ID and ACS URL are required.");
                return;
              }
              nextStep();
            }}>Next</button>
          </div>
        </>
      )}

      {/* Step 3: Attributes */}
      {step === 3 && (
        <>
          <label className="block mb-2 text-sm font-medium text-gray-700">Expected Attributes (one per line)</label>
          <textarea rows={5} className="w-full px-4 py-2 border rounded mb-4" value={attributes} onChange={(e) => setAttributes(e.target.value)} placeholder="e.g.\nurn:oasis:names:tc:SAML:2.0:attrname-format:basic:email" />
          <div className="flex justify-between">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={prevStep}>Back</button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={nextStep}>Next</button>
          </div>
        </>
      )}

      {/* Step 4: Review & Submit */}
      {step === 4 && (
        <>
          <h3 className="text-xl font-bold mb-4">Review Your Submission</h3>
          <ul className="text-sm text-gray-800 space-y-2">
            <li><strong>App Name:</strong> {appName}</li>
            <li><strong>Description:</strong> {description}</li>
            <li><strong>APM ID:</strong> {apmID}</li>
            <li><strong>Jira Ticket:</strong> {jiraTicket}</li>
            <li><strong>Entity ID:</strong> {entityId}</li>
            <li><strong>ACS URL:</strong> {acsUrl}</li>
            <li><strong>Expected Attributes:</strong> <pre>{attributes}</pre></li>
          </ul>
          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={prevStep}>Back</button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={async () => {
                const payload = {
                  appName,
                  description,
                  apmID,
                  jiraTicket,
                  entityId,
                  acsUrl,
                  attributes,
                  userEmail: "testuser@example.com", // replace with real user email from login
                };

                try {
                  const res = await fetch("http://localhost:5000/api/integrations/saml", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });

                  if (!res.ok) throw new Error("Server error");

                  const data = await res.json();
                  alert("SAML request submitted! ID: " + data.id);
                  nextStep(); // move to metadata download & instructions
                } catch (err) {
                  console.error(err);
                  alert("Submission failed. Please try again.");
                }
              }}
            >
              Submit
            </button>
          </div>
        </>
      )}

      {/* Step 5: Metadata download + instructions */}
      {step === 5 && (
        <>
          <p className="mb-4 text-green-700">✅ Your request has been submitted!</p>
          <p className="mb-2">If you are working with a vendor, please download and share this metadata:</p>
          <a href="/sso/idp-metadata.xml" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Download IdP Metadata
          </a>
          <p className="mt-6 text-gray-700">📌 Next steps: An IAM admin will follow up to review attribute mappings and approve your request.</p>
        </>
      )}
    </div>
  );
}

export default SAMLWizard;