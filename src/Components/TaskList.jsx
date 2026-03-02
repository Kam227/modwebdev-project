import { useEffect, useState } from "react";
import { getTasks } from "../services/tasksService";
import Task from "./Task";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await getTasks({ limit: 50 });
        if (!cancelled) setTasks(data);
      } catch (err) {
        if (!cancelled) setErrorMsg(err?.message ?? "Failed to load tasks");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Loading…</p>;
  if (errorMsg) return <p style={{ color: "crimson" }}>{errorMsg}</p>;
  if (tasks.length === 0) return <p>No tasks found.</p>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {tasks.map((t) => (
        <Task key={t.id} task={t} />
      ))}
    </div>
  );
}