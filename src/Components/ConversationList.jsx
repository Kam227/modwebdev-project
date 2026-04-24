import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getConversations } from "../services/MessagingService";
import Parse from "../services/parseClient";

export default function ConversationList() {
  const [convs, setConvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const current = Parse.User.current();

  useEffect(() => {
    getConversations()
      .then(setConvs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #e8e8e8", display: "flex", alignItems: "center", gap: 12, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#555", fontSize: 22, lineHeight: 1 }}>←</Link>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>Messages</h2>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <p style={{ padding: "24px 16px", color: "#aaa", textAlign: "center" }}>Loading...</p>
        ) : convs.length === 0 ? (
          <p style={{ padding: "24px 16px", color: "#aaa", textAlign: "center" }}>No conversations yet.</p>
        ) : (
          convs.map(({ user, lastMessage, isSent }) => {
            const firstName = user.get("firstName") || "";
            const lastName = user.get("lastName") || "";
            const name = `${firstName} ${lastName}`.trim() || user.get("username") || "Unknown";
            const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
            const preview = lastMessage.get("text") || "";

            return (
              <div
                key={user.id}
                onClick={() => navigate(`/chat/${user.id}`)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #f2f2f2", background: "#fff", transition: "background 0.12s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f7f7")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                {/* Avatar */}
                <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#4A90E2", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                  {initials}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: "#1a1a1a", marginBottom: 2 }}>{name}</div>
                  <div style={{ fontSize: 13, color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {isSent ? "You: " : ""}{preview}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
