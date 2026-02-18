import { useState } from "react";
import api from "../api/client";

export default function MoodList({ moods, onDelete, onSuccess }) {
  const [open, setOpen] = useState(false);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this mood entry?");
    if (!ok) return;

    try {
      await api.delete(`journal/moods/${id}/`);
      onDelete();
      onSuccess("Mood deleted successfully.");
    } catch (err) {
      console.error("Failed to delete mood:", err);
    }
  };

  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Recent Entries</span>
        <span style={{ fontSize: "14px" }}>
          {open ? "▲" : "▼"} ({moods.length})
        </span>
      </button>

      {open && (
        <div style={{ marginTop: "15px" }}>
          {moods.length === 0 && <p>No entries yet.</p>}

          {moods.map((mood) => (
            <div
              key={mood.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                paddingBottom: "8px",
                borderBottom: "2px solid #eeeee",
              }}
            >
              <div>
                <strong>Mood {mood.mood_score}</strong>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {new Date(mood.created_at).toLocaleString()}
                </div>
              </div>

              <button
                style={{ backgroundColor: "#ef4444" }}
                onClick={() => handleDelete(mood.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
