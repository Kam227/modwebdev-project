export default function House({ house }) {
  const line1 = house.unit ? `${house.street}, Unit ${house.unit}` : house.street;
  const line2 = `${house.city}, ${house.state} ${house.zip}`;
  const line3 = house.country;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <div style={{ fontWeight: 600 }}>{line1}</div>
      <div>{line2}</div>
      <div style={{ opacity: 0.7 }}>{line3}</div>
    </div>
  );
}