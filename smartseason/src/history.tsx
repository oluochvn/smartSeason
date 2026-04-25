import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

type Update = {
  id: string;
  field_id: string;
  agent_id: string;
  previous_stage?: string;
  new_stage: string;
  notes?: string;
  created_at: string;
};

export default function History() {
  const navigate = useNavigate();

  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user?.id) {
      navigate("/");
      return;
    }

    fetch("http://localhost:3000/updates", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const allUpdates: Update[] = data.updates || [];

        // Filter only this agent's updates
        const myUpdates = allUpdates.filter(
          (u) => u.agent_id === user.id
        );

        setUpdates(myUpdates);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6 text-gray-500">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Update History
        </h1>

        <p className="text-gray-500 mt-1">
          View all updates you have submitted.
        </p>
      </section>

      <section className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow p-5">
          {updates.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No updates submitted yet.
            </p>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <div
                  key={update.id}
                  className="border rounded-xl p-4"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">
                      Stage → {update.new_stage}
                    </p>

                    <span className="text-xs text-gray-400">
                      {new Date(update.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    {update.notes || "No notes provided"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}