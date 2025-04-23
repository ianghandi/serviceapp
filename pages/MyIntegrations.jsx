import { useEffect, useState } from "react";

function MyIntegrations() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate API call
  useEffect(() => {
    // In production, you'd call: fetch('/api/my-integrations')
    const fakeData = [
      {
        id: "1",
        type: "OAuth",
        appName: "Marketing App",
        status: "Approved",
        expiresIn: 18,
        needsADGroups: true,
      },
      {
        id: "2",
        type: "SAML",
        appName: "HR Portal",
        status: "Pending",
        expiresIn: null,
        needsADGroups: null,
      },
      {
        id: "3",
        type: "OAuth",
        appName: "Internal Tool",
        status: "Approved",
        expiresIn: 4,
        needsADGroups: false,
      },
    ];
    setTimeout(() => {
      setIntegrations(fakeData);
      setLoading(false);
    }, 500);
  }, []);

  const toggleADGroups = (id) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, needsADGroups: !item.needsADGroups }
          : item
      )
    );

    // TODO: Send update to backend
    console.log("Updated AD group toggle for ID:", id);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">My Integrations</h2>

      {loading ? (
        <p className="text-gray-500">Loading integrations...</p>
      ) : integrations.length === 0 ? (
        <p className="text-gray-600">You have not submitted any integrations yet.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="py-2 px-3">App Name</th>
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Days Left</th>
              <th className="py-2 px-3">AD Groups in ID Token</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3 font-medium">{item.appName}</td>
                <td className="py-2 px-3">{item.type}</td>
                <td className="py-2 px-3">{item.status}</td>
                <td className="py-2 px-3">
                  {item.status === "Approved"
                    ? `${item.expiresIn} day${item.expiresIn !== 1 ? "s" : ""}`
                    : "—"}
                </td>
                <td className="py-2 px-3">
                  {item.type === "OAuth" && item.status === "Approved" ? (
                    <button
                      onClick={() => toggleADGroups(item.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        item.needsADGroups
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {item.needsADGroups ? "Yes (Click to Remove)" : "No (Click to Add)"}
                    </button>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyIntegrations;
