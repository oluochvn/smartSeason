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
      (usersData.users || []).filter((user: User) => user.role === "agent")
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
    if (!form.name || !form.crop_type || !form.planting_date) {
      alert("Field name, crop type, and planting date are required");
      return;
    }

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

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to create field");
      return;
    }

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
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this field?")) return;

    await fetch(`https://pb424.onrender.com/fields/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadData();
  };

  const getAgentEmail = (agentId?: string) => {
    return agents.find((agent) => agent.id === agentId)?.email || "Unassigned";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Fields Management
        </h1>

        <p className="text-gray-500 mt-1">
          Create fields and assign them to field agents.
        </p>
      </section>

      <section className="px-6 pb-6">
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
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.email}
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
            className="bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
          >
            Create Field
          </button>
        </div>
      </section>

      <section className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">All Fields</h2>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2">Name</th>
                <th>Crop</th>
                <th>Planting Date</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Agent</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {fields.map((field) => (
                <tr key={field.id} className="border-b">
                  <td className="py-3 font-medium">{field.name}</td>
                  <td>{field.crop_type}</td>
                  <td>{field.planting_date}</td>
                  <td>{field.current_stage}</td>
                  <td>{field.status}</td>
                  <td>{getAgentEmail(field.assigned_agent)}</td>
                  <td>{field.location || "N/A"}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(field.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {fields.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 text-gray-400">
                    No fields found
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
