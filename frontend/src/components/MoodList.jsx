import { useMemo, useState } from "react";
import api from "../api/client";

export default function MoodList({ moods, onDelete, onSuccess, privacyMode }) {
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [expandedId, setExpandedId] = useState(null);

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
      onDelete();
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
    <section className="dashboard-card moodlist-card">
      <button type="button" className="dropdown-button" onClick={toggleOpen}>
        <span>Recent Entries</span>
        <div className="d-flex align-items-center gap-2">
          <span className="entries-count">{sortedMoods.length}</span>
          <span className={`arrow ${open ? "open" : ""}`}>⌄</span>
        </div>
      </button>

      <div className={`dropdown-content ${open ? "open" : ""}`}>
        {sortedMoods.length === 0 && <p className="mb-0 text-muted">No entries yet.</p>}

        <div className="d-grid gap-3">
          {shownMoods.map((mood) => {
            const isExpanded = expandedId === mood.id;
            const isEditing = editingId === mood.id;

            return (
              <article key={mood.id} className={`entry-card ${isExpanded ? "expanded" : ""}`}>
                <div className="entry-head d-flex justify-content-between gap-3">
                  <div>
                    <p className="entry-title mb-1">
                      {moodEmojis[mood.mood_score]} Mood {mood.mood_score}
                    </p>
                    <p className="mood-date mb-0">{new Date(mood.created_at).toLocaleString()}</p>
                  </div>
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => toggleExpand(mood.id)}>
                    {isExpanded ? "Collapse" : "Expand"}
                  </button>
                </div>

                {mood.emotions && (
                  <p className="mood-meta mb-0">
                    <strong>Emotions:</strong> {mood.emotions}
                  </p>
                )}

                {!privacyMode && !isExpanded && mood.journal_text && (
                  <p className="mood-meta mb-0">
                    <strong>Journal:</strong>{" "}
                    {mood.journal_text.length > 80
                      ? `${mood.journal_text.slice(0, 80)}...`
                      : mood.journal_text}
                  </p>
                )}

                {isExpanded && (
                  <div className="expanded-entry">
                    {isEditing ? (
                      <div className="journal-full">
                        <p className="entry-title mb-3">Edit Entry</p>

                        <label className="small-label" htmlFor={`edit-mood-${mood.id}`}>
                          Mood score
                        </label>
                        <input
                          id={`edit-mood-${mood.id}`}
                          className="mood-slider"
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={editMoodScore}
                          onChange={(e) => setEditMoodScore(Number(e.target.value))}
                        />
                        <p className="mood-meta mt-1 mb-3">
                          {moodEmojis[editMoodScore]} Mood {editMoodScore}
                        </p>

                        <label className="small-label" htmlFor={`edit-emotions-${mood.id}`}>
                          Emotions
                        </label>
                        <input
                          id={`edit-emotions-${mood.id}`}
                          className="form-input"
                          value={editEmotions}
                          onChange={(e) => setEditEmotions(e.target.value)}
                          placeholder="e.g., tired, anxious"
                        />

                        <label className="small-label" htmlFor={`edit-journal-${mood.id}`}>
                          Journal
                        </label>
                        <textarea
                          id={`edit-journal-${mood.id}`}
                          className="form-input form-textarea"
                          value={editJournal}
                          onChange={(e) => setEditJournal(e.target.value)}
                          placeholder="Write..."
                        />

                        <div className="entry-actions d-flex justify-content-end gap-2">
                          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={cancelEdit} disabled={savingEdit}>
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => saveEdit(mood.id)}
                            disabled={savingEdit}
                          >
                            {savingEdit ? "Saving..." : "Save changes"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {!privacyMode && mood.journal_text && (
                          <div className="journal-full">
                            <p className="entry-title mb-2">Full Journal</p>
                            <div className="journal-text">{mood.journal_text}</div>
                          </div>
                        )}

                        {privacyMode && (
                          <div className="journal-full">
                            <p className="entry-title mb-2">Privacy Mode</p>
                            <div className="journal-text">
                              Journal text is hidden. Turn off Privacy Mode to view.
                            </div>
                          </div>
                        )}

                        <div className="entry-actions d-flex justify-content-end gap-2">
                          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => startEdit(mood)}>
                            Edit
                          </button>
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(mood.id)}>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {open && hasMore && (
          <button
            type="button"
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
    </section>
  );
}
