import { useState, useEffect } from "react";
import api from "./api/client";
import Login from "./pages/Login";
import MoodForm from "./components/MoodForm";
import MoodTrendChart from "./charts/MoodTrendChart";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access_token"));
  const [trend, setTrend] = useState([]);

  const loadData = async () => {
    const res = await api.get("insights/trend/");
    setTrend(res.data);
  };

  useEffect(() => {
    if (loggedIn) loadData();
  }, [loggedIn]);

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <>
      <MoodForm onAdd={loadData} />
      <MoodTrendChart data={trend} />
    </>
  );
}
