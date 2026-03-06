import { Link } from "react-router-dom";

export default function Task({ task }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        {task.description || "Untitled Task"}
      </div>

      <div><b>Location:</b> {task.location || "—"}</div>
      <div><b>Openings:</b> {task.openings ?? "—"}</div>
      <div><b>Training Needed:</b> {String(task.trainingNeeded ?? "—")}</div>
      <div><b>Certificate Aid:</b> {String(task.certificateAid ?? "—")}</div>

      <div style={{ marginTop: 8 }}>
        <b>Contact:</b>{" "}
        {task.contact ? (
          <Link to={`/contacts/${task.contact.id}`}>
            {task.contact.name || "View Contact"}
          </Link>
        ) : (
          "—"
        )}
      </div>
    </div>
  );
}