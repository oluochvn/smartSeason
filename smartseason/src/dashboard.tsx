import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/");
      return;
    }

    const loggedUser = JSON.parse(storedUser);
    setUser(loggedUser);

    fetch(`http://localhost:3000/profile/${loggedUser.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setUser(data.profile);
          localStorage.setItem("user", JSON.stringify(data.profile));
        }
      })
      .catch(console.log);

    fetch("http://localhost:3000/fields", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFields(data.fields || []))
      .catch(console.log);

    fetch("http://localhost:3000/updates", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUpdates(data.updates || []))
      .catch(console.log);

    // only admin should fetch users
    if (loggedUser.role === "admin") {
      fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setAgents(data.users || []))
        .catch(console.log);
    }
  }, [navigate]);

  const role = user?.role?.toLowerCase();
  const isAdmin = role === "admin";
  const isAgent = role === "agent";

  const activeFields = fields.filter((f) => f.status === "Active");
  const atRiskFields = fields.filter((f) => f.status === "At Risk");
  const completedFields = fields.filter((f) => f.status === "Completed");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isAdmin ? "Admin Dashboard" : "Field Agent Dashboard"}
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome, {user?.email}
        </p>

        <p className="text-sm text-green-700 font-medium mt-1 capitalize">
          Role: {role || "agent"}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">
            {isAdmin ? "Total Fields" : "Assigned Fields"}
          </h2>
          <p className="text-2xl font-bold">{fields.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Active</h2>
          <p className="text-2xl font-bold text-green-700">
            {activeFields.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">At Risk</h2>
          <p className="text-2xl font-bold text-yellow-600">
            {atRiskFields.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Completed</h2>
          <p className="text-2xl font-bold text-blue-700">
            {completedFields.length}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {isAdmin && (
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
                {agents.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="py-2">{u.email}</td>
                    <td className="py-2 capitalize">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">
            Recent Updates
          </h2>

          {updates.length === 0 ? (
            <p className="text-sm text-gray-400">No updates yet</p>
          ) : (
            updates.slice(0, 5).map((u) => (
              <div key={u.id} className="border rounded p-3 mb-2 text-sm">
                <p className="font-medium">
                  Stage → {u.new_stage}
                </p>
                <p className="text-gray-500">
                  {u.notes || "No notes"}
                </p>
              </div>
            ))
          )}
        </div>

        {isAgent && (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold mb-4">
              My Fields
            </h2>

            {fields.length === 0 ? (
              <p className="text-sm text-gray-400">
                No assigned fields
              </p>
            ) : (
              fields.slice(0, 5).map((f) => (
                <div key={f.id} className="border p-3 mb-2 text-sm">
                  <p className="font-medium">{f.name}</p>
                  <p className="text-gray-500">
                    {f.crop_type} • {f.current_stage}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}