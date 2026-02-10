import { useState } from "react";
import api from "../api/client";

export default function MoodForm({ onAdd }) {
  const [mood, setMood] = useState(3);
  const [text, setText] = useState("");
  const [emotions, setEmotions] = useState("");

  const submit = async () => {
    await api.post("journal/moods/", {
      mood_score: mood,
      journal_text: text,
      emotions,
    });
    onAdd();
  };

  return (
    <div>
      <h3>Add Mood</h3>
      <input type="number" min="1" max="5" value={mood} onChange={e => setMood(e.target.value)} />
      <input placeholder="Emotions" onChange={e => setEmotions(e.target.value)} />
      <textarea placeholder="Journal" onChange={e => setText(e.target.value)} />
      <button onClick={submit}>Save</button>
    </div>
  );
}
