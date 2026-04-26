import { useEffect, useState } from "react";
import Navbar from "../Navbar";

type Agent = {
  id: string;
  email: string;
  role: string;
};

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

export default function AdFields() {
  const [fields, setFields] = useState<Field[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

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

  const loadFields = async () => {
    const res = await fetch("http://localhost:3000/fields", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setFields(data.fields || []);
  };

  const loadAgents = async () => {
    const res = await fetch("http://localhost:3000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    const onlyAgents = (data.users || []).filter(
      (user: Agent) => user.role === "agent"
    );

    setAgents(onlyAgents);
  };

  useEffect(() => {
    if (token) {
      loadFields();
      loadAgents();
    }
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name || !form.crop_type || !form.planting_date) {
      alert("Field name, crop type, and planting date are required");
      return;
    }

    await fetch("http://localhost:3000/fields", {
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

    loadFields();
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this field?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:3000/fields/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadFields();
  };

  const getAgentEmail = (agentId?: string) => {
    const agent = agents.find((a) => a.id === agentId);
    return agent ? agent.email : "Not assigned";
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
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-5 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Field name"
            className="border px-3 py-2 rounded-lg"
          />

          <input
            name="crop_type"
            value={form.crop_type}
            onChange={handleChange}
            placeholder="Crop type"
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
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="border px-3 py-2 rounded-lg"
          />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes"
            className="border px-3 py-2 rounded-lg md:col-span-2"
          />

          <button
            type="submit"
            className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800"
          >
            Add Field
          </button>
        </form>
      </section>

      <section className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">All Fields</h2>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Crop</th>
                <th className="py-2">Planting Date</th>
                <th className="py-2">Stage</th>
                <th className="py-2">Status</th>
                <th className="py-2">Agent</th>
                <th className="py-2">Location</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {fields.map((field) => (
                <tr key={field.id} className="border-b">
                  <td className="py-3 font-medium">{field.name}</td>
                  <td className="py-3">{field.crop_type}</td>
                  <td className="py-3">{field.planting_date}</td>
                  <td className="py-3">{field.current_stage}</td>
                  <td className="py-3">{field.status}</td>
                  <td className="py-3">{getAgentEmail(field.assigned_agent)}</td>
                  <td className="py-3">{field.location || "N/A"}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(field.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {fields.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 text-gray-400">
                    No fields found.
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
