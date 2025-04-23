import { useEffect, useState } from "react";

function AdminReview() {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Replace this with a real fetch call
    const fakeSubmissions = [
      {
        id: "1",
        type: "OAuth",
        appName: "Dev Portal",
        status: "Pending",
        submitter: "alice@example.com",
        apmID: "APM123",
        jira: "https://jira.example.com/browse/DEV-456",
        clientId: "dev-portal-client",
        needsADGroups: false,
      },
      {
        id: "2",
        type: "SAML",
        appName: "Vendor App",
        status: "Pending",
        submitter: "bob@example.com",
        apmID: "APM789",
        jira: "https://jira.example.com/browse/IDP-222",
        entityId: "https://vendor.example.com/saml",
      },
    ];
    setSubmissions(fakeSubmissions);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">Admin Review Panel</h2>

      {selected === null ? (
        <>
          <p className="mb-4 text-gray-600">Click "Review" to view or edit submissions.</p>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-2 px-3">App Name</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Submitter</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3">{s.appName}</td>
                  <td className="py-2 px-3">{s.type}</td>
                  <td className="py-2 px-3">{s.status}</td>
                  <td className="py-2 px-3">{s.submitter}</td>
                  <td className="py-2 px-3">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
                      onClick={() => setSelected(s)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <AdminReviewForm
          data={selected}
          onBack={() => setSelected(null)}
          onApprove={() => alert("Integration Approved!")}
          onReject={() => alert("Integration Rejected.")}
        />
      )}
    </div>
  );
}

function AdminReviewForm({ data, onBack, onApprove, onReject }) {
  const [formData, setFormData] = useState({ ...data });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <button className="text-blue-600 underline mb-2" onClick={onBack}>
        ← Back to list
      </button>

      <h3 className="text-xl font-semibold">Review: {formData.appName}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700">App Name</label>
          <input
            className="w-full border px-3 py
