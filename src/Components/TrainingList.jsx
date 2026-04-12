import { useEffect, useState } from "react";
import { getTrainings } from "../services/trainingsService";
import Training from "./Training";

export default function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    /**
     * Effect to load trainings when the component mounts.
     * It fetches a list of trainings from the API and updates the state accordingly.
     * It also handles loading and error states to provide feedback to the user.
     */
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

  /**
   * Render loading, error, or list of trainings based on the current state.
   */
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