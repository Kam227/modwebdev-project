export default function TrainingModal({ training, onClose }) {
  return (
    <div onClick={onClose} style={styles.overlay}>
      <div onClick={(e) => e.stopPropagation()} style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>

        <div style={styles.tag}>Training</div>
        <h2 style={styles.title}>{training.description || "Untitled Training"}</h2>

        <div style={styles.grid}>
          <Field label="Location" value={training.location} />
          <Field
            label="Max Capacity"
            value={training.maxCapacity != null ? String(training.maxCapacity) : null}
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  if (value == null || value === "") return null;
  return (
    <div style={styles.field}>
      <div style={styles.fieldLabel}>{label}</div>
      <div style={styles.fieldValue}>{value}</div>
    </div>
  );
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
  tag: {
    display: "inline-block",
    background: "#10b98118",
    color: "#10b981",
    borderRadius: 999,
    padding: "3px 12px",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    margin: "0 0 20px",
    lineHeight: 1.3,
    paddingRight: 24,
    color: "#111",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
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
    textAlign: "right",
    color: "#222",
  },
};
