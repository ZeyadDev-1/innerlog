import { useState } from "react";
import api from "../api/client";

export default function MoodForm({ onAdd, onSuccess }) {
  const [mood, setMood] = useState(3);
  const [text, setText] = useState("");
  const [emotions, setEmotions] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const moodLabels = {
    1: { emoji: "😞", text: "Very Low" },
    2: { emoji: "😕", text: "Low" },
    3: { emoji: "😐", text: "Neutral" },
    4: { emoji: "🙂", text: "Good" },
    5: { emoji: "😁", text: "Very Good" },
  };

  const submit = async () => {
    setError("");
    setSaving(true);

    try {
      await api.post("journal/moods/", {
        mood_score: Number(mood),
        journal_text: text,
        emotions,
      });

      setMood(3);
      setText("");
      setEmotions("");

      onAdd();
      onSuccess("Mood saved successfully!");
    } catch {
      setError("Failed to save mood.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="dashboard-card mood-form-card">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <p className="section-kicker mb-1">Daily check-in</p>
          <h3 className="section-title mb-0">How are you feeling today?</h3>
        </div>
      </div>

      {error && <p className="text-danger small mb-3">{error}</p>}

      <div className="mood-indicator mb-3">
        <span className="mood-emoji" aria-hidden="true">{moodLabels[mood]?.emoji}</span>
        <div>
          <p className="small-label mb-1">Current mood</p>
          <p className="mood-value mb-0">{moodLabels[mood]?.text}</p>
        </div>
      </div>

      <div className="mb-3">
        <label className="small-label" htmlFor="mood-slider">Mood score</label>
        <input
          id="mood-slider"
          className="mood-slider"
          type="range"
          min="1"
          max="5"
          step="1"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
        />
        <div className="mood-scale" aria-hidden="true">
          <span>😞</span>
          <span>😕</span>
          <span>😐</span>
          <span>🙂</span>
          <span>😁</span>
        </div>
      </div>

      <label className="small-label" htmlFor="mood-emotions">Emotions</label>
      <input
        id="mood-emotions"
        className="form-input"
        placeholder="e.g., calm, focused, hopeful"
        value={emotions}
        onChange={(e) => setEmotions(e.target.value)}
      />

      <label className="small-label" htmlFor="mood-journal">Journal note</label>
      <textarea
        id="mood-journal"
        className="form-input form-textarea"
        placeholder="Write a gentle reflection about your day..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="button" className="btn btn-primary w-100 mt-2" onClick={submit} disabled={saving}>
        {saving ? "Saving..." : "Save reflection"}
      </button>
    </section>
  );
}
