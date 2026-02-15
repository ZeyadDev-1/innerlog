import api from "../api/client";

export default function MoodList({ moods, onDelete }) {
  const handleDelete = async (id) => {
    try {
      await api.delete(`journal/moods/${id}/`);
      onDelete();
    } catch (err) {
      console.error("Failed to delete mood:", err);
    }
  };

  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
      <h3>Recent Entries</h3>

      {moods.length === 0 && <p>No entries yet.</p>}

      {moods.map((mood) => (
        <div
          key={mood.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            paddingBottom: "5px",
            borderBottom: "1px solid #eee",
          }}
        >
          <div>
            <strong>Mood {mood.mood_score}</strong>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {new Date(mood.created_at).toLocaleDateString()}
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
  );
}
