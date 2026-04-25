import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

type User = {
  id: string;
  email: string;
  role: "admin" | "agent";
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

export default function MyFields() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  const [updateForm, setUpdateForm] = useState<
    Record<string, { new_stage: string; notes: string }>
  >({});

  const token = localStorage.getItem("token");

  const loadFields = async (userId: string) => {
    const res = await fetch("http://localhost:3000/fields", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    const allFields: Field[] = data.fields || [];

    const assignedFields = allFields.filter(
      (field) => String(field.assigned_agent) === String(userId)
    );

    setFields(assignedFields);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/");
      return;
    }

    const loggedUser: User = JSON.parse(storedUser);
    setUser(loggedUser);

    loadFields(loggedUser.id).finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (
    fieldId: string,
    key: "new_stage" | "notes",
    value: string
  ) => {
    setUpdateForm({
      ...updateForm,
      [fieldId]: {
        ...updateForm[fieldId],
        [key]: value,
      },
    });
  };

  const handleUpdate = async (field: Field) => {
    const form = updateForm[field.id];

    if (!form?.new_stage) {
      alert("Select a stage");
      return;
    }

    const res = await fetch("http://localhost:3000/updates", {
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

    alert("Updated successfully");

    setUpdateForm({
      ...updateForm,
      [field.id]: { new_stage: "", notes: "" },
    });

    loadFields(user!.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6 text-gray-500">Loading fields...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Assigned Fields
        </h1>

        <p className="text-gray-500 mt-1">
          Update only fields assigned to you
        </p>
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

                  <p className="text-sm text-gray-500">
                    {field.crop_type}
                  </p>

                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>Stage: {field.current_stage}</p>
                    <p>Status: {field.status}</p>
                    <p>Date: {field.planting_date}</p>
                    {field.location && <p>Location: {field.location}</p>}
                    {field.notes && <p>Notes: {field.notes}</p>}
                  </div>

                  <div className="mt-4 space-y-3">
                    <select
                      value={updateForm[field.id]?.new_stage || ""}
                      onChange={(e) =>
                        handleChange(field.id, "new_stage", e.target.value)
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
                        handleChange(field.id, "notes", e.target.value)
                      }
                      placeholder="Add notes"
                      className="w-full border px-3 py-2 rounded-lg"
                    />

                    <button
                      onClick={() => handleUpdate(field)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Submit Update
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