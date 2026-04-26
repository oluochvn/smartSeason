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

export default function MyFields() {
  const [fields, setFields] = useState<Field[]>([]);
  const [updateForm, setUpdateForm] = useState<
    Record<string, { new_stage: string; notes: string }>
  >({});

  const token = localStorage.getItem("token");

  const loadFields = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch("https://pb424.onrender.com/fields", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    const assigned = (data.fields || []).filter(
      (f: Field) => String(f.assigned_agent) === String(user.id)
    );

    setFields(assigned);
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

    if (!form?.new_stage) return;

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

    if (res.ok) {
      setUpdateForm({
        ...updateForm,
        [field.id]: { new_stage: "", notes: "" },
      });
      loadFields();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Assigned Fields
        </h1>
      </section>

      <section className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow p-5">
          {fields.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No fields assigned yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.id} className="border rounded-xl p-4">
                  <h3 className="font-bold text-gray-800">
                    {field.name}
                  </h3>

                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>{field.crop_type}</p>
                    <p>{field.planting_date}</p>
                    <p>{field.location || "N/A"}</p>
                    <p>{field.current_stage}</p>
                    <p>{field.status}</p>
                    <p>{field.notes || "No notes"}</p>
                  </div>

                  <div className="mt-4 space-y-3">
                    <select
                      value={updateForm[field.id]?.new_stage || ""}
                      onChange={(e) =>
                        handleUpdateChange(field.id, "new_stage", e.target.value)
                      }
                      className="w-full border px-3 py-2 rounded-lg"
                    >
                      <option value="">Select stage</option>
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
                      className="w-full border px-3 py-2 rounded-lg"
                    />

                    <button
                      onClick={() => handleUpdate(field)}
                      className="w-full bg-green-700 text-white py-2 rounded-lg"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
