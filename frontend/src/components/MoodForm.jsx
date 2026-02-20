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
        mood_score: Number(mood), // ensure numeric
        journal_text: text,
        emotions,
      });

      // Clear form after success
      setMood(3);
      setText("");
      setEmotions("");

      onAdd();
      onSuccess("Mood saved successfully!");
    } catch (err) {
      setError("Failed to save mood.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h3>Add Mood</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Emoji Slider */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontWeight: "600",
            marginBottom: "6px",
          }}
        >
          Mood: {moodLabels[mood]?.emoji} {moodLabels[mood]?.text}
        </label>

        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          style={{ width: "95%" }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "25px",
            marginTop: "3px",
          }}
        >
          <span>😞</span>
          <span>😕</span>
          <span>😐</span>
          <span>🙂</span>
          <span>😁</span>
        </div>
      </div>

      {/* Emotions */}
      <input
        placeholder="Emotions (e.g., anxious, excited, tired)"
        value={emotions}
        onChange={(e) => setEmotions(e.target.value)}
      />

      {/* Journal */}
      <textarea
        placeholder="Write about your day..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Save Button */}
      <button onClick={submit} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </>
  );
}