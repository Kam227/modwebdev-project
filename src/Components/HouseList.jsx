import { useEffect, useState } from "react";
import { getHouses } from "../services/housesService";
import House from "./House";

export default function HouseList() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await getHouses({ limit: 50 });
        if (!cancelled) setHouses(data);
      } catch (err) {
        if (!cancelled) setErrorMsg(err?.message ?? "Failed to load houses");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Loading…</p>;
  if (errorMsg) return <p style={{ color: "crimson" }}>{errorMsg}</p>;
  if (houses.length === 0) return <p>No houses found.</p>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {houses.map((h) => (
        <House key={h.id} house={h} />
      ))}
    </div>
  );
}