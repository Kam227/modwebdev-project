export default function Training({ training }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        {training.description || "Untitled Training"}
      </div>

      <div><b>Location:</b> {training.location || "—"}</div>
      <div><b>Max Capacity:</b> {training.maxCapacity ?? "—"}</div>
    </div>
  );
}