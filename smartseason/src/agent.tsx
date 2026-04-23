import { useState } from "react";

const NAV_ITEMS = ["Dashboard", "Fields", "Agents", "Report"];

function Agents() {
  const [active, setActive] = useState("Agents");

  const [agents, setAgents] = useState([
    { id: 1, name: "John", field: "Field A" },
    { id: 2, name: "Mary", field: "Field B" },
  ]);

  const [form, setForm] = useState({ name: "", field: "" });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.field) return;

    if (editingId) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === editingId ? { ...a, ...form } : a
        )
      );
      setEditingId(null);
    } else {
      setAgents((prev) => [
        ...prev,
        { id: Date.now(), ...form },
      ]);
    }

    setForm({ name: "", field: "" });
  };

  const handleEdit = (agent) => {
    setForm({ name: agent.name, field: agent.field });
    setEditingId(agent.id);
  };

  const handleDelete = (id) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-950 h-14 flex items-center justify-between px-10">
        <div className="flex items-center gap-8">
          <span className="text-green-400 font-semibold text-lg">
            Shamba
          </span>

          <nav>
            <ul className="flex text-white/60 font-bold gap-4">
              {NAV_ITEMS.map((item) => (
                <li
                  key={item}
                  onClick={() => setActive(item)}
                  className={`cursor-pointer ${
                    active === item ? "text-white" : ""
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center text-xs font-semibold text-green-400">
            AD
          </div>
          <span className="text-white/60 text-sm">Admin</span>
        </div>
      </header>

      <section className="p-6">
        <div className="bg-white p-4 rounded-lg shadow flex gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Agent name"
            className="border px-3 py-2 rounded w-full"
          />

          <input
            name="field"
            value={form.field}
            onChange={handleChange}
            placeholder="Assigned field"
            className="border px-3 py-2 rounded w-full"
          />

          <button
            onClick={handleSubmit}
            className="bg-green-900 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </section>

      <section className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Agents</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Field</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b">
                  <td className="py-2">{agent.name}</td>
                  <td className="py-2">{agent.field}</td>
                  <td className="py-2 flex gap-4">
                    <button
                      onClick={() => handleEdit(agent)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {agents.length === 0 && (
                <tr>
                  <td className="py-2 text-gray-400">No agents</td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Agents;