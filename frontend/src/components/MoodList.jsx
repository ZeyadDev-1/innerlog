import { useMemo, useState } from "react";
import api from "../api/client";

export default function MoodList({ moods, onDelete, onSuccess, privacyMode }) {
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [expandedId, setExpandedId] = useState(null);

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editMoodScore, setEditMoodScore] = useState(3);
  const [editEmotions, setEditEmotions] = useState("");
  const [editJournal, setEditJournal] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const moodEmojis = { 1: "😞", 2: "😕", 3: "😐", 4: "🙂", 5: "😁" };

  const sortedMoods = useMemo(() => {
    return [...moods].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [moods]);

  const shownMoods = sortedMoods.slice(0, visibleCount);
  const hasMore = visibleCount < sortedMoods.length;

  const toggleOpen = () => {
    setOpen((v) => !v);
    if (!open) {
      setVisibleCount(5);
      setExpandedId(null);
      setEditingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((curr) => (curr === id ? null : id));
    setEditingId(null);
  };

  const startEdit = (mood) => {
    setEditingId(mood.id);
    setExpandedId(mood.id);
    setEditMoodScore(Number(mood.mood_score));
    setEditEmotions(mood.emotions || "");
    setEditJournal(mood.journal_text || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    setSavingEdit(true);
    try {
      await api.patch(`journal/moods/${id}/`, {
        mood_score: Number(editMoodScore),
        emotions: editEmotions,
        journal_text: editJournal,
      });
      setEditingId(null);
      onDelete(); // re-fetch (same function you use for refresh)
      onSuccess("Entry updated successfully.");
    } catch (err) {
      console.error("Failed to update mood:", err);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this mood entry?");
    if (!ok) return;

    try {
      await api.delete(`journal/moods/${id}/`);
      setExpandedId(null);
      setEditingId(null);
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
          const isEditing = editingId === mood.id;

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
                  <div className="mood-meta">
                    <strong>Emotions:</strong> {mood.emotions}
                  </div>
                )}

                {/* COLLAPSED PREVIEW (respect privacyMode) */}
                {!privacyMode && !isExpanded && mood.journal_text && (
                  <div className="mood-meta">
                    <strong>Journal:</strong>{" "}
                    {mood.journal_text.length > 80
                      ? mood.journal_text.slice(0, 80) + "..."
                      : mood.journal_text}
                  </div>
                )}

                {/* EXPANDED */}
                {isExpanded && (
                  <div style={{ marginTop: "10px" }}>
                    {/* EDIT MODE */}
                    {isEditing ? (
                      <div className="journal-full">
                        <strong>Edit Entry</strong>

                        <div style={{ marginTop: 10 }}>
                          <label className="small-label">Mood Score</label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={editMoodScore}
                            onChange={(e) => setEditMoodScore(Number(e.target.value))}
                            style={{ width: "100%" }}
                          />
                          <div style={{ fontSize: 12, color: "#666" }}>
                            {moodEmojis[editMoodScore]} Mood {editMoodScore}
                          </div>
                        </div>

                        <div style={{ marginTop: 10 }}>
                          <label className="small-label">Emotions</label>
                          <input
                            value={editEmotions}
                            onChange={(e) => setEditEmotions(e.target.value)}
                            placeholder="e.g., tired, anxious"
                          />
                        </div>

                        <div style={{ marginTop: 10 }}>
                          <label className="small-label">Journal</label>
                          <textarea
                            value={editJournal}
                            onChange={(e) => setEditJournal(e.target.value)}
                            placeholder="Write..."
                            style={{ width: "100%" }}
                          />
                        </div>

                        <div className="entry-actions">
                          <button
                            className="expand-button"
                            onClick={cancelEdit}
                            disabled={savingEdit}
                          >
                            Cancel
                          </button>
                          <button
                            className="delete-button small"
                            onClick={() => saveEdit(mood.id)}
                            disabled={savingEdit}
                          >
                            {savingEdit ? "Saving..." : "Save changes"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* FULL JOURNAL (respect privacyMode) */}
                        {!privacyMode && mood.journal_text && (
                          <div className="journal-full">
                            <strong>Full Journal</strong>
                            <div className="journal-text">{mood.journal_text}</div>
                          </div>
                        )}

                        {privacyMode && (
                          <div className="journal-full">
                            <strong>Privacy Mode</strong>
                            <div className="journal-text">
                              Journal text is hidden. Turn off Privacy Mode to view.
                            </div>
                          </div>
                        )}

                        <div className="entry-actions">
                          <button className="expand-button" onClick={() => startEdit(mood)}>
                            Edit
                          </button>
                          <button
                            className="delete-button small"
                            onClick={() => handleDelete(mood.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

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