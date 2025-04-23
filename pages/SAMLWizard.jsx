import { useState } from "react";

function SAMLWizard() {
  const [step, setStep] = useState(1);
  const [entityId, setEntityId] = useState("");
  const [acsUrl, setAcsUrl] = useState("");
  const [attributes, setAttributes] = useState("");

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">SAML Integration Wizard</h2>

      {step === 1 && (
        <>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Entity ID
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded mb-4"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
          />
          <label className="block mb-2 text-sm font-medium text-gray-700">
            ACS URL
          </label>
          <input
            type="url"
            className="w-full px-4 py-2 border rounded mb-4"
            value={acsUrl}
            onChange={(e) => setAcsUrl(e.target.value)}
          />
          <div className="flex justify-end">
            <button onClick={nextStep} className="px-4 py-2 bg-purple-600 text-white rounded">Next</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Expected Attributes (one per line)
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-2 border rounded mb-4"
            value={attributes}
            onChange={(e) => setAttributes(e.target.value)}
          />
          <div className="flex justify-between">
            <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Back</button>
            <button onClick={nextStep} className="px-4 py-2 bg-purple-600 text-white rounded">Next</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p className="mb-4 text-green-700">Thank you! An admin will review your request. Please share this metadata file if required.</p>
          <a
            href="/sso/idp-metadata.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Download IdP Metadata
          </a>
        </>
      )}
    </div>
  );
}

export default SAMLWizard;
