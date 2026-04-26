import { useEffect, useState } from "react";
import Navbar from "../Navbar";

const API_URL = "https://pb424.onrender.com";

type User = {
  id: string;
  email: string;
  role: string;
};

type Field = {
  id: string;
  name: string;
  assigned_agent?: string;
};

export default function AdAgents() {
  const [users, setUsers] = useState<User[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const loadData = async () => {
    try {
      setError("");

      const usersRes = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const usersData = await usersRes.json();

      if (!usersRes.ok) {
        setError(usersData.message || "Failed to load users");
        return;
      }

      setUsers(usersData.users || []);

      const fieldsRes = await fetch(`${API_URL}/fields`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fieldsData = await fieldsRes.json();

      if (!fieldsRes.ok) {
        setError(fieldsData.message || "Failed to load fields");
        return;
      }

      setFields(fieldsData.fields || []);
    } catch (err) {
      setError("Server connection failed");
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const getAssignedCount = (agentId: string) => {
    return fields.filter(
      (field) => String(field.assigned_agent) === String(agentId)
    ).length;
  };

  const agents = users.filter(
    (user) => user.role?.toLowerCase() === "agent"
  );

  const admins = users.filter(
    (user) => user.role?.toLowerCase() === "admin"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Agents Management
        </h1>

        <p className="text-gray-500 mt-1">
          View registered users and field agents.
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Users</h2>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Field Agents</h2>
          <p className="text-2xl font-bold text-green-700">
            {agents.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Admins</h2>
          <p className="text-2xl font-bold">{admins.length}</p>
        </div>
      </section>

      <section className="p-6">
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Field Agents</h2>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Assigned Fields</th>
              </tr>
            </thead>

            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b">
                  <td className="py-3">{agent.email}</td>
                  <td className="py-3 capitalize">{agent.role}</td>
                  <td className="py-3">{getAssignedCount(agent.id)}</td>
                </tr>
              ))}

              {agents.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-gray-400">
                    No agents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Admin Users</h2>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b">
                  <td className="py-3">{admin.email}</td>
                  <td className="py-3 capitalize">{admin.role}</td>
                </tr>
              ))}

              {admins.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-gray-400">
                    No admins found.
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
