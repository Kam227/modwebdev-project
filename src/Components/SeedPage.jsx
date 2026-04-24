import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { seedAll } from "../utils/seedContacts";

export default function SeedPage() {
  const [results, setResults] = useState([]);
  const [done, setDone]       = useState(false);
  const navigate              = useNavigate();

  useEffect(() => {
    seedAll(setResults).then(() => setDone(true));
  }, []);

  return (
    <div style={{ maxWidth: 480, margin: "60px auto", fontFamily: "sans-serif", padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Seeding data…</h2>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {results.map((r, i) => (
          <li key={i} style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
            <span>{r.name}</span>
            <span style={{ color: r.status.startsWith("✓") ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
              {r.status}
            </span>
          </li>
        ))}
      </ul>

      {done && (
        <button
          onClick={() => navigate("/auth")}
          style={{ marginTop: 32, padding: "10px 28px", background: "#4A90E2", color: "#fff", border: "none", borderRadius: 20, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
        >
          Done — go to login
        </button>
      )}
    </div>
  );
}
