import { useEffect, useState } from "react";
import Navbar from "./Navbar";

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

export default function MyFields() {
  const [fields, setFields] = useState<Field[]>([]);
  const [updateForm, setUpdateForm] = useState<
    Record<string, { new_stage: string; notes: string }>
  >({});

  const token = localStorage.getItem("token");

  const loadFields = async () => {
    const res = await fetch("https://pb424.onrender.com/fields", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setFields(data.fields || []);
  };

  useEffect(() => {
    if (token) loadFields();
  }, [token]);

  const handleUpdateChange = (
    fieldId: string,
    name: "new_stage" | "notes",
    value: string
  ) => {
    setUpdateForm({
      ...updateForm,
      [fieldId]: {
        ...updateForm[fieldId],
        [name]: value,
      },
    });
  };

  const handleUpdate = async (field: Field) => {
    const form = updateForm[field.id];

    if (!form?.new_stage) {
      alert("Please select a stage");
      return;
    }

    const res = await fetch("https://pb424.onrender.com/updates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        field_id: field.id,
        new_stage: form.new_stage,
        notes: form.notes || "",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }

    alert("Field updated successfully");

    setUpdateForm({
      ...updateForm,
      [field.id]: {
        new_stage: "",
        notes: "",
      },
    });

    loadFields();
  };

  const statusClass = (status: string) => {
    if (status === "Completed") return "bg-blue-100 text-blue-700";
    if (status === "At Risk") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const stageClass = (stage: string) => {
    if (stage === "Harvested") return "bg-blue-50 text-blue-700";
    if (stage === "Ready") return "bg-purple-50 text-purple-700";
    if (stage === "Growing") return "bg-green-50 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="px-6 pt-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Assigned Fields
        </h1>

        <p className="text-gray-500 mt-1">
          View your assigned fields, update crop stage, and add observations.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Assigned Fields</p>
          <h2 className="text-2xl font-bold text-gray-800">
            {fields.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Active</p>
          <h2 className="text-2xl font-bold text-green-700">
            {fields.filter((f) => f.status === "Active").length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-2xl font-bold text-blue-700">
            {fields.filter((f) => f.status === "Completed").length}
          </h2>
        </div>
      </section>

      <section className="px-6 pb-6">
        {fields.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-400 text-sm">
              No fields assigned yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {fields.map((field) => (
              <div
                key={field.id}
                className="bg-white rounded-xl shadow border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {field.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {field.crop_type}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClass(
                      field.status
                    )}`}
                  >
                    {field.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400">Current Stage</p>
                    <span
                      className={`inline-block mt-1 text-xs font-semibold px-2 py-1 rounded-full ${stageClass(
                        field.current_stage
                      )}`}
                    >
                      {field.current_stage}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400">Planting Date</p>
                    <p className="font-medium text-gray-700">
                      {field.planting_date}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400">Location</p>
                    <p className="font-medium text-gray-700">
                      {field.location || "N/A"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400">Last Notes</p>
                    <p className="font-medium text-gray-700">
                      {field.notes || "No notes"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t pt-4">
                  <p className="font-semibold text-gray-800 mb-3">
                    Submit Field Update
                  </p>

                  <div className="space-y-3">
                    <select
                      value={updateForm[field.id]?.new_stage || ""}
                      onChange={(e) =>
                        handleUpdateChange(
                          field.id,
                          "new_stage",
                          e.target.value
                        )
                      }
                      className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Select new stage</option>
                      <option value="Planted">Planted</option>
                      <option value="Growing">Growing</option>
                      <option value="Ready">Ready</option>
                      <option value="Harvested">Harvested</option>
                    </select>

                    <textarea
                      value={updateForm[field.id]?.notes || ""}
                      onChange={(e) =>
                        handleUpdateChange(field.id, "notes", e.target.value)
                      }
                      placeholder="Add notes or observations"
                      className="w-full border px-3 py-2 rounded-lg min-h-24 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />

                    <button
                      onClick={() => handleUpdate(field)}
                      className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
                    >
                      Submit Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
