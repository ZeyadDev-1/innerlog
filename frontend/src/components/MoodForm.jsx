import { useState } from "react";
import api from "../api/client";

export default function MoodForm({ onAdd }) {
  const [mood, setMood] = useState(3);
  const [text, setText] = useState("");
  const [emotions, setEmotions] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    try {
      await api.post("journal/moods/", {
        mood_score: mood,
        journal_text: text,
        emotions,
      });

      onAdd();
    } catch (err) {
      setError("Failed to save mood.");
    }
  };

  return (
    <>
      <h3>Add Mood</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="number"
        min="1"
        max="5"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      />

      <input
        placeholder="Emotions"
        value={emotions}
        onChange={(e) => setEmotions(e.target.value)}
      />

      <textarea
        placeholder="Journal"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={submit}>Save</button>
    </>
  );
}
