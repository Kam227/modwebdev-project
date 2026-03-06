import { useEffect, useState } from "react";
import { getTrainings } from "../services/trainingsService";
import Training from "./Training";

export default function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErrorMsg("");
        const data = await getTrainings({ limit: 50 });
        if (!cancelled) setTrainings(data);
      } catch (err) {
        if (!cancelled) setErrorMsg(err?.message ?? "Failed to load trainings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Loading trainings...</p>;
  if (errorMsg) return <p style={{ color: "crimson" }}>{errorMsg}</p>;
  if (trainings.length === 0) return <p>No trainings found.</p>;

  return (
    <div className="grid">
      {trainings.map((training) => (
        <Training key={training.id} training={training} />
      ))}
    </div>
  );
}