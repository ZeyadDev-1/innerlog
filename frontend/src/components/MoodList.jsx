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
    <div className="moodlist-card">
      <button
        className="dropdown-button"
        onClick={() => setOpen((v) => !v)}
      >
        <span>Recent Entries ({moods.length})</span>
        <span className={`arrow ${open ? "open" : ""}`}>▼</span>
      </button>

      <div className={`dropdown-content ${open ? "open" : ""}`}>
        {moods.length === 0 && <p>No entries yet.</p>}

        {moods.map((mood) => (
          <div key={mood.id} className="mood-row">
            <div>
              <strong>Mood {mood.mood_score}</strong>
              <div className="mood-date">
                {new Date(mood.created_at).toLocaleString()}
              </div>
            </div>

            <button
              className="delete-button"
              onClick={() => handleDelete(mood.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}