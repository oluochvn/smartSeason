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
  current_stage: "Planted" | "Growing" | "Ready" | "Harvested";
  status: "Active" | "At Risk" | "Completed";
  location?: string;
  notes?: string;
  assigned_agent?: string;
};

export default function Agent() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/");
      return;
    }

    const loggedUser: User = JSON.parse(storedUser);
    setUser(loggedUser);

    fetch("http://localhost:3000/fields", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const allFields: Field[] = data.fields || [];

        const assignedFields = allFields.filter(
          (field) => field.assigned_agent === loggedUser.id
        );

        setFields(assignedFields);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const activeFields = fields.filter((field) => field.status === "Active");
  const atRiskFields = fields.filter((field) => field.status === "At Risk");
  const completedFields = fields.filter((field) => field.status === "Completed");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6 text-gray-500">Loading assigned fields...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Field Agent Page
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome, {user?.email}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Assigned Fields</h2>
          <p className="text-2xl font-bold">{fields.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Active</h2>
          <p className="text-2xl font-bold text-green-700">
            {activeFields.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">At Risk</h2>
          <p className="text-2xl font-bold text-yellow-600">
            {atRiskFields.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Completed</h2>
          <p className="text-2xl font-bold text-blue-700">
            {completedFields.length}
          </p>
        </div>
      </section>

      <section className="p-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">
            My Assigned Fields
          </h2>

          {fields.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No fields assigned yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="border rounded-xl p-4 hover:shadow transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {field.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {field.crop_type}
                      </p>
                    </div>

                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      {field.status}
                    </span>
                  </div>

                  <div className="mt-4 text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Stage:</span>{" "}
                      {field.current_stage}
                    </p>

                    <p>
                      <span className="font-medium">Planting Date:</span>{" "}
                      {field.planting_date}
                    </p>

                    {field.location && (
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {field.location}
                      </p>
                    )}

                    {field.notes && (
                      <p>
                        <span className="font-medium">Notes:</span>{" "}
                        {field.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/update/${field.id}`)}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Update Field
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}