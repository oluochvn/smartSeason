import { useEffect, useState } from "react";
import Navbar from "../Navbar";

type Update = {
  id: string;
  field_id: string;
  agent_id: string;
  previous_stage?: string;
  new_stage: string;
  notes?: string;
  created_at: string;
};

type Field = {
  id: string;
  name: string;
};

type User = {
  id: string;
  email: string;
  role: string;
};

export default function AdUpdates() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("https://pb424.onrender.com/updates", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUpdates(data.updates || []))
      .catch((err) => console.log(err));

    fetch("https://pb424.onrender.com/fields", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFields(data.fields || []))
      .catch((err) => console.log(err));

    fetch("https://pb424.onrender.com/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch((err) => console.log(err));
  }, [token]);

  const getFieldName = (fieldId: string) => {
    return fields.find((field) => field.id === fieldId)?.name || "Unknown field";
  };

  const getAgentEmail = (agentId: string) => {
    return users.find((user) => user.id === agentId)?.email || "Unknown agent";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Field Updates
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor updates submitted by field agents.
        </p>
      </section>

      <section className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">
            All Updates
          </h2>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Field</th>
                <th className="py-2">Agent</th>
                <th className="py-2">Previous Stage</th>
                <th className="py-2">New Stage</th>
                <th className="py-2">Notes</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {updates.map((update) => (
                <tr key={update.id} className="border-b">
                  <td className="py-3">{getFieldName(update.field_id)}</td>
                  <td className="py-3">{getAgentEmail(update.agent_id)}</td>
                  <td className="py-3">
                    {update.previous_stage || "N/A"}
                  </td>
                  <td className="py-3 font-medium text-green-700">
                    {update.new_stage}
                  </td>
                  <td className="py-3">
                    {update.notes || "No notes"}
                  </td>
                  <td className="py-3">
                    {new Date(update.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}

              {updates.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-gray-400">
                    No updates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}