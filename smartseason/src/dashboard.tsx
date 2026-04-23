import { useState } from "react";

const NAV_ITEMS = ["Dashboard", "Fields", "Agents", "Report"];

function Dashboard() {
  const [active, setActive] = useState("Dashboard");

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

      <section className="grid grid-cols-4 gap-6 p-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500">Total Fields</h2>
          <p className="text-xl font-bold">0</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500">Total Agents</h2>
          <p className="text-xl font-bold">0</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500">At Risk</h2>
          <p className="text-xl font-bold">0</p>
        </div>

        <button className="bg-white p-4 rounded-lg shadow text-left">
          <h2 className="text-sm text-gray-500">Add Field</h2>
          <p className="text-xl font-bold">+</p>
        </button>
      </section>

      <section className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-2">Field</th>
                <th className="py-2">Agent</th>
                <th className="py-2">Status</th>
                <th className="py-2">Last Update</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              <tr className="border-b">
                <td className="py-2">Field A</td>
                <td className="py-2">John</td>
                <td className="py-2">Good</td>
                <td className="py-2">Today</td>
              </tr>

              <tr className="border-b">
                <td className="py-2">Field B</td>
                <td className="py-2">Mary</td>
                <td className="py-2">At Risk</td>
                <td className="py-2">Yesterday</td>
              </tr>

              <tr>
                <td className="py-2">Field C</td>
                <td className="py-2">Alex</td>
                <td className="py-2">Good</td>
                <td className="py-2">2 days ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;