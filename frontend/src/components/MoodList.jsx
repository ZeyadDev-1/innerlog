import { useState } from "react";
import api from "../api/client";

export default function MoodList({ moods, onDelete, onSuccess }) {
  const [open, setOpen] = useState(false);

  const moodEmojis = {
    1: "😞",
    2: "😕",
    3: "😐",
    4: "🙂",
    5: "😁",
  };

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
      {/* Dropdown Header */}
      <button
        className="dropdown-button"
        onClick={() => setOpen((v) => !v)}
      >
        <span>Recent Entries ({moods.length})</span>
        <span className={`arrow ${open ? "open" : ""}`}>▼</span>
      </button>

      {/* Dropdown Content */}
      <div className={`dropdown-content ${open ? "open" : ""}`}>
        {moods.length === 0 && <p>No entries yet.</p>}

        {moods.map((mood) => (
          <div key={mood.id} className="mood-row">
            <div style={{ flex: 1 }}>
              <strong>
                {moodEmojis[mood.mood_score]} Mood {mood.mood_score}
              </strong>

              <div className="mood-date">
                {new Date(mood.created_at).toLocaleString()}
              </div>

              {/* Emotions */}
              {mood.emotions && (
                <div style={{ fontSize: "12px", marginTop: "4px", color: "#444" }}>
                  <strong>Emotions:</strong> {mood.emotions}
                </div>
              )}

              {/* Journal Preview */}
              {mood.journal_text && (
                <div style={{ fontSize: "12px", marginTop: "4px", color: "#444" }}>
                  <strong>Journal:</strong>{" "}
                  {mood.journal_text.length > 80
                    ? mood.journal_text.slice(0, 80) + "..."
                    : mood.journal_text}
                </div>
              )}
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