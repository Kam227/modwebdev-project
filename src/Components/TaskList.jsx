import { useEffect, useState } from "react";
import { getTasks } from "../services/tasksService";
import Task from "./Task";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    /**
     * Effect to load tasks when the component mounts. 
     * It fetches a list of tasks from the API and updates the state accordingly. 
     * It also handles loading and error states to provide feedback to the user.
     */
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

  /**
   * Render loading, error, or list of tasks based on the current state.
   */
  if (loading) return <p>Loading tasks...</p>;
  if (errorMsg) return <p style={{ color: "crimson" }}>{errorMsg}</p>;
  if (tasks.length === 0) return <p>No tasks found.</p>;

  return (
    <div className="grid">
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
}