import { useEffect, useState } from "react";
import Navbar from "../Navbar";

type Field = {
  id: string;
  name: string;
  crop_type: string;
  current_stage: string;
  status: string;
  assigned_agent?: string;
};

export default function AdReport() {
  const [fields, setFields] = useState<Field[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("https://pb424.onrender.com/fields", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFields(data.fields || []))
      .catch((err) => console.log(err));
  }, [token]);

  const totalFields = fields.length;
  const activeFields = fields.filter((f) => f.status === "Active").length;
  const atRiskFields = fields.filter((f) => f.status === "At Risk").length;
  const completedFields = fields.filter((f) => f.status === "Completed").length;

  const plantedFields = fields.filter((f) => f.current_stage === "Planted").length;
  const growingFields = fields.filter((f) => f.current_stage === "Growing").length;
  const readyFields = fields.filter((f) => f.current_stage === "Ready").length;
  const harvestedFields = fields.filter((f) => f.current_stage === "Harvested").length;

  const unassignedFields = fields.filter((f) => !f.assigned_agent).length;

  const cropSummary = fields.reduce<Record<string, number>>((acc, field) => {
    acc[field.crop_type] = (acc[field.crop_type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Reports
        </h1>
        <p className="text-gray-500 mt-1">
          Field status, crop, and stage breakdown.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Fields</h2>
          <p className="text-2xl font-bold">{totalFields}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Active</h2>
          <p className="text-2xl font-bold text-green-700">{activeFields}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">At Risk</h2>
          <p className="text-2xl font-bold text-yellow-600">{atRiskFields}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Completed</h2>
          <p className="text-2xl font-bold text-blue-700">{completedFields}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Stage Breakdown</h2>

          <div className="space-y-3 text-sm">
            <p>Planted: <span className="font-bold">{plantedFields}</span></p>
            <p>Growing: <span className="font-bold">{growingFields}</span></p>
            <p>Ready: <span className="font-bold">{readyFields}</span></p>
            <p>Harvested: <span className="font-bold">{harvestedFields}</span></p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Field Insights</h2>

          <div className="space-y-3 text-sm">
            <p>
              Unassigned Fields:{" "}
              <span className="font-bold text-red-600">{unassignedFields}</span>
            </p>

            <p>
              Ready for Harvest:{" "}
              <span className="font-bold text-green-700">{readyFields}</span>
            </p>

            <p>
              At Risk Fields:{" "}
              <span className="font-bold text-yellow-600">{atRiskFields}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">
            Crop Summary
          </h2>

          {Object.keys(cropSummary).length === 0 ? (
            <p className="text-sm text-gray-400">
              No crop data available.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2">Crop Type</th>
                  <th className="py-2">Fields</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(cropSummary).map(([crop, count]) => (
                  <tr key={crop} className="border-b">
                    <td className="py-3">{crop}</td>
                    <td className="py-3 font-bold">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}