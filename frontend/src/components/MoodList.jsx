import { useMemo, useState } from "react";
import api from "../api/client";

export default function MoodList({ moods, onDelete, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [expandedId, setExpandedId] = useState(null);

  const moodEmojis = {
    1: "😞",
    2: "😕",
    3: "😐",
    4: "🙂",
    5: "😁",
  };

  // Sort newest first (important if backend returns oldest first)
  const sortedMoods = useMemo(() => {
    return [...moods].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [moods]);

  const shownMoods = sortedMoods.slice(0, visibleCount);
  const hasMore = visibleCount < sortedMoods.length;

  const toggleOpen = () => {
    setOpen((v) => !v);

    // reset visible count and expanded entry when opening
    if (!open) {
      setVisibleCount(5);
      setExpandedId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this mood entry?");
    if (!ok) return;

    try {
      await api.delete(`journal/moods/${id}/`);
      setExpandedId(null);
      onDelete();
      onSuccess("Mood deleted successfully.");
    } catch (err) {
      console.error("Failed to delete mood:", err);
    }
  };

  return (
    <div className="moodlist-card">
      <button className="dropdown-button" onClick={toggleOpen}>
        <span>Recent Entries ({sortedMoods.length})</span>
        <span className={`arrow ${open ? "open" : ""}`}>▼</span>
      </button>

      <div className={`dropdown-content ${open ? "open" : ""}`}>
        {sortedMoods.length === 0 && <p>No entries yet.</p>}

        {shownMoods.map((mood) => {
          const isExpanded = expandedId === mood.id;

          return (
            <div key={mood.id} className="mood-row">
              <div style={{ flex: 1 }}>
                <strong>
                  {moodEmojis[mood.mood_score]} Mood {mood.mood_score}
                </strong>

                <div className="mood-date">
                  {new Date(mood.created_at).toLocaleString()}
                </div>

                {mood.emotions && (
                  <div style={{ fontSize: "12px", marginTop: "4px", color: "#444" }}>
                    <strong>Emotions:</strong> {mood.emotions}
                  </div>
                )}

                {/* COLLAPSED: show preview */}
                {!isExpanded && mood.journal_text && (
                  <div style={{ fontSize: "12px", marginTop: "4px", color: "#444" }}>
                    <strong>Journal:</strong>{" "}
                    {mood.journal_text.length > 80
                      ? mood.journal_text.slice(0, 80) + "..."
                      : mood.journal_text}
                  </div>
                )}

                {/* EXPANDED: show full journal + delete inside */}
                {isExpanded && (
                  <div style={{ marginTop: "10px" }}>
                    {mood.journal_text && (
                      <div
                        style={{
                          background: "#f9fafb",
                          border: "1px solid #eee",
                          borderRadius: "8px",
                          padding: "12px",
                        }}
                      >
                        <strong>Full Journal</strong>
                        <div
                          style={{
                            marginTop: "8px",
                            fontSize: "13px",
                            lineHeight: 1.5,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {mood.journal_text}
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                      }}
                    >
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(mood.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* PRIMARY ACTION BUTTON */}
              <button className="expand-button" onClick={() => toggleExpand(mood.id)}>
                {isExpanded ? "Collapse" : "Expand"}
              </button>
            </div>
          );
        })}

        {open && hasMore && (
          <button
            className="show-more-button"
            onClick={() => setVisibleCount((c) => c + 5)}
          >
            Show more (+5)
          </button>
        )}

        {open && !hasMore && sortedMoods.length > 5 && (
          <div className="all-shown-note">All entries shown.</div>
        )}
      </div>
    </div>
  );
}