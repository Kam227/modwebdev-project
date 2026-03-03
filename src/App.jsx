<<<<<<< HEAD
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskList from "./components/TaskList";
import Contact from "./components/Contact";
=======
import './App.css'
import * as Env from "./environments";
import Parse from "parse"
import Components from './Components/Components'
>>>>>>> 41d5ade (irrelevant)

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