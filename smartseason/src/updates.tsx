import { useState } from "react";

const NAV_ITEMS = ["Dashboard", "Fields", "Agents", "Assignments", "Updates"];

function Updates() {
  const [active, setActive] = useState("Updates");

  const [updates, setUpdates] = useState([
    {
      id: 1,
      field: "Field A",
      stage: "Growing",
      note: "Healthy crops",
      date: "Today",
    },
  ]);

  const [form, setForm] = useState({
    field: "",
    stage: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.field || !form.stage) return;

    setUpdates([
      ...updates,
      {
        id: Date.now(),
        ...form,
        date: "Now",
      },
    ]);

    setForm({ field: "", stage: "", note: "" });
  };

  const handleDelete = (id) => {
    setUpdates(updates.filter((u) => u.id !== id));
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
            name="field"
            value={form.field}
            onChange={handleChange}
            placeholder="Field name"
            className="border px-3 py-2 rounded w-full"
          />

          <select
            name="stage"
            value={form.stage}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">Select stage</option>
            <option>Planted</option>
            <option>Growing</option>
            <option>Ready</option>
            <option>Harvested</option>
            <option>At risk</option>
          </select>

          <input
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Note"
            className="border px-3 py-2 rounded w-full"
          />

          <button
            onClick={handleAdd}
            className="bg-green-900 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </section>

      <section className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Updates</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-2">Field</th>
                <th className="py-2">Stage</th>
                <th className="py-2">Note</th>
                <th className="py-2">Date</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {updates.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-2">{u.field}</td>
                  <td className="py-2">{u.stage}</td>
                  <td className="py-2">{u.note}</td>
                  <td className="py-2">{u.date}</td>
                  <td className="py-2">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {updates.length === 0 && (
                <tr>
                  <td className="py-2 text-gray-400">No updates</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Updates;