import { useEffect, useState } from "react";
import Navbar from "../Navbar";

type User = {
  id: string;
  email: string;
  role: "admin" | "agent";
};

type Field = {
  id: string;
  name: string;
  crop_type: string;
  planting_date: string;
  current_stage: string;
  status: string;
  location?: string;
};

type Update = {
  id: string;
  new_stage: string;
  notes?: string;
  created_at: string;
};

export default function AdDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (!token) return;

    fetch("http://localhost:3000/fields", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFields(data.fields || []))
      .catch((err) => console.log(err));

    fetch("http://localhost:3000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch((err) => console.log(err));

    fetch("http://localhost:3000/updates", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUpdates(data.updates || []))
      .catch((err) => console.log(err));
  }, [token]);

  const agents = users.filter((u) => u.role === "agent");
  const admins = users.filter((u) => u.role === "admin");

  const activeFields = fields.filter((f) => f.status === "Active");
  const atRiskFields = fields.filter((f) => f.status === "At Risk");
  const completedFields = fields.filter((f) => f.status === "Completed");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome, {user?.email}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Fields</h2>
          <p className="text-2xl font-bold text-gray-800">
            {fields.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Active Fields</h2>
          <p className="text-2xl font-bold text-green-700">
            {activeFields.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">At Risk Fields</h2>
          <p className="text-2xl font-bold text-yellow-600">
            {atRiskFields.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Completed Fields</h2>
          <p className="text-2xl font-bold text-blue-700">
            {completedFields.length}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mt-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Registered Users</h2>
          <p className="text-2xl font-bold text-gray-800">
            {users.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Field Agents</h2>
          <p className="text-2xl font-bold text-green-700">
            {agents.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Admins</h2>
          <p className="text-2xl font-bold text-gray-800">
            {admins.length}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">
            Registered Users
          </h2>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-2">{u.email}</td>
                  <td className="py-2 capitalize">{u.role}</td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td className="py-3 text-gray-400" colSpan={2}>
                    No registered users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">
            Recent Field Updates
          </h2>

          {updates.length === 0 ? (
            <p className="text-sm text-gray-400">
              No updates yet.
            </p>
          ) : (
            <div className="space-y-3">
              {updates.slice(0, 5).map((update) => (
                <div
                  key={update.id}
                  className="border rounded-lg p-3 text-sm"
                >
                  <p className="font-medium text-gray-800">
                    Stage changed to {update.new_stage}
                  </p>

                  <p className="text-gray-500">
                    {update.notes || "No notes added"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(update.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}