import { useState } from "react";
import { Link } from "react-router-dom";

export default function TaskModal({ task, onClose }) {
  const [showCert, setShowCert] = useState(false);

  return (
    <div onClick={onClose} style={styles.overlay}>
      <div onClick={(e) => e.stopPropagation()} style={styles.modal}>
        {showCert ? (
          <CertificateStage
            cert={task.certificateAid}
            onBack={() => setShowCert(false)}
            onClose={onClose}
          />
        ) : (
          <TaskStage
            task={task}
            onClose={onClose}
            onViewCert={() => setShowCert(true)}
          />
        )}
      </div>
    </div>
  );
}

function TaskStage({ task, onClose, onViewCert }) {
  return (
    <>
      <button onClick={onClose} style={styles.closeBtn}>✕</button>

      <div style={styles.tag("#3b82f6")}>Task</div>
      <h2 style={styles.title}>{task.description || "Untitled Task"}</h2>

      <div style={styles.fieldList}>
        <Field label="Location" value={task.location} />
        <Field label="Openings" value={task.openings} />
        <Field
          label="Training Needed"
          value={task.trainingNeeded != null ? String(task.trainingNeeded) : null}
        />

        {/* Certificate Aid — clickable if it exists */}
        <div style={styles.field}>
          <span style={styles.fieldLabel}>Certificate Aid</span>
          {task.certificateAid ? (
            <button onClick={onViewCert} style={styles.certChip}>
              View Certificate →
            </button>
          ) : (
            <span style={styles.fieldValue}>—</span>
          )}
        </div>
      </div>

      {task.contact && (
        <div style={styles.contactBox}>
          <div style={styles.contactLabel}>Contact / Employer</div>
          <div style={styles.contactName}>
            <Link
              to={`/contacts/${task.contact.id}`}
              onClick={onClose}
              style={styles.link}
            >
              {task.contact.name || "View Profile"}
            </Link>
          </div>
          {task.contact.phoneNumber && (
            <div style={styles.contactDetail}>📞 {task.contact.phoneNumber}</div>
          )}
          {task.contact.email && (
            <div style={styles.contactDetail}>✉️ {task.contact.email}</div>
          )}
        </div>
      )}
    </>
  );
}

function CertificateStage({ cert, onBack, onClose }) {
  // Display all fields except the id
  const entries = Object.entries(cert).filter(([key]) => key !== "id");

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <button onClick={onBack} style={styles.backBtn}>← Back</button>
        <button onClick={onClose} style={{ ...styles.closeBtn, position: "static" }}>✕</button>
      </div>

      <div style={styles.tag("#f59e0b")}>Certificate Aid</div>
      <h2 style={styles.title}>Certificate Details</h2>

      <div style={styles.fieldList}>
        {entries.length > 0 ? (
          entries.map(([key, value]) => (
            <Field
              key={key}
              label={formatKey(key)}
              value={value != null ? String(value) : null}
            />
          ))
        ) : (
          <p style={{ color: "#888", fontSize: 14 }}>No details available.</p>
        )}
      </div>
    </>
  );
}

function Field({ label, value }) {
  if (value == null || value === "" || value === "null") return null;
  return (
    <div style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      <span style={styles.fieldValue}>{value}</span>
    </div>
  );
}

// Converts camelCase or PascalCase keys to readable labels
function formatKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: 20,
  },
  modal: {
    background: "#fff",
    color: "#222",
    borderRadius: 20,
    padding: 32,
    width: "100%",
    maxWidth: 480,
    position: "relative",
    boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
    maxHeight: "85vh",
    overflowY: "auto",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "#f0f0f0",
    border: "none",
    borderRadius: "50%",
    width: 32,
    height: 32,
    cursor: "pointer",
    fontSize: 14,
    color: "#444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    background: "#f0f0f0",
    border: "none",
    borderRadius: 999,
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    color: "#444",
  },
  tag: (color) => ({
    display: "inline-block",
    background: color + "18",
    color,
    borderRadius: 999,
    padding: "3px 12px",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  }),
  title: {
    fontSize: 20,
    fontWeight: 700,
    margin: "0 0 20px",
    lineHeight: 1.3,
    paddingRight: 24,
    color: "#111",
  },
  fieldList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
  },
  field: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: 8,
    gap: 12,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#888",
    flexShrink: 0,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: 500,
    color: "#222",
    textAlign: "right",
  },
  certChip: {
    background: "#f59e0b18",
    color: "#f59e0b",
    border: "none",
    borderRadius: 999,
    padding: "4px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  contactBox: {
    background: "#f8f8f8",
    borderRadius: 12,
    padding: "14px 16px",
    marginTop: 8,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#888",
    marginBottom: 6,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 6,
    color: "#111",
  },
  contactDetail: {
    fontSize: 13,
    color: "#555",
    marginTop: 3,
  },
  link: {
    color: "#3b82f6",
    textDecoration: "none",
  },
};
