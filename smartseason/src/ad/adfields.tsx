import { useEffect, useState } from "react";
import Navbar from "../Navbar";

type Field = {
  id: string;
  name: string;
  crop_type: string;
  planting_date: string;
  current_stage: string;
  status: string;
  location?: string;
  notes?: string;
  assigned_agent?: string;
};

type User = {
  id: string;
  email: string;
  role: string;
};

export default function AdFields() {
  const [fields, setFields] = useState<Field[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [form, setForm] = useState({
    name: "",
    crop_type: "",
    planting_date: "",
    current_stage: "Planted",
    status: "Active",
    location: "",
    notes: "",
    assigned_agent: "",
  });

  const token = localStorage.getItem("token");

  const loadData = async () => {
    const [fieldsRes, usersRes] = await Promise.all([
      fetch("https://pb424.onrender.com/fields", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("https://pb424.onrender.com/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const fieldsData = await fieldsRes.json();
    const usersData = await usersRes.json();

    setFields(fieldsData.fields || []);
    setAgents(
      (usersData.users || []).filter((u: User) => u.role === "agent")
    );
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.crop_type || !form.planting_date) return;

    const res = await fetch("https://pb424.onrender.com/fields", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        assigned_agent: form.assigned_agent || null,
      }),
    });

    if (res.ok) {
      setForm({
        name: "",
        crop_type: "",
        planting_date: "",
        current_stage: "Planted",
        status: "Active",
        location: "",
        notes: "",
        assigned_agent: "",
      });
      loadData();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`https://pb424.onrender.com/fields/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadData();
  };

  const getAgentEmail = (id?: string) =>
    agents.find((a) => a.id === id)?.email || "Unassigned";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        <div className="bg-white p-5 rounded-xl shadow grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            placeholder="Field name"
            value={form.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
          />

          <input
            name="crop_type"
            placeholder="Crop type"
            value={form.crop_type}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
          />

          <input
            type="date"
            name="planting_date"
            value={form.planting_date}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
          />

          <select
            name="current_stage"
            value={form.current_stage}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="Planted">Planted</option>
            <option value="Growing">Growing</option>
            <option value="Ready">Ready</option>
            <option value="Harvested">Harvested</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="Active">Active</option>
            <option value="At Risk">At Risk</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            name="assigned_agent"
            value={form.assigned_agent}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">Assign agent</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.email}
              </option>
            ))}
          </select>

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg"
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg md:col-span-2"
          />

          <button
            onClick={handleSubmit}
            className="bg-green-700 text-white py-2 rounded-lg"
          >
            Create
          </button>
        </div>
      </section>

      <section className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2">Name</th>
                <th>Crop</th>
                <th>Date</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Agent</th>
                <th>Location</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {fields.map((f) => (
                <tr key={f.id} className="border-b">
                  <td className="py-2">{f.name}</td>
                  <td>{f.crop_type}</td>
                  <td>{f.planting_date}</td>
                  <td>{f.current_stage}</td>
                  <td>{f.status}</td>
                  <td>{getAgentEmail(f.assigned_agent)}</td>
                  <td>{f.location || "N/A"}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {fields.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-3 text-gray-400">
                    No fields
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
