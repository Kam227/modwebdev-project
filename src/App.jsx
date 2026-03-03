import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskList from "./components/TaskList";
import Contact from "./components/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16 }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Tasks</h1>
                <TaskList />
              </>
            }
          />
          <Route path="/contacts/:id" element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
