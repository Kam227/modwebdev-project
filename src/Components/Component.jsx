import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TaskList from "./TaskList";
import TrainingList from "./TrainingList";
import ContactPage from "./Contact";

function HomePage() {
  return (
    <div>
      <h1>Volunteer App</h1>
      <p>Select a page:</p>

      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/tasks">Tasks</Link>
        <Link to="/trainings">Trainings</Link>
      </nav>
    </div>
  );
}

/**
 * Main component that sets up routing for the volunteer app.
 * It defines routes for the home page, task list, training list, and contact page.
 */
export default function Component() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/trainings" element={<TrainingList />} />
          <Route path="/contacts/:id" element={<ContactPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}