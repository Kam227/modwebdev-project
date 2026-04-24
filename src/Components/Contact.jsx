import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getContactById } from "../services/contactsService";
import Parse from "../services/parseClient";

export default function Contact() {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

const handleMessage = async () => {
  if (contact.userId) {
    navigate(`/chat/${contact.userId}`);
    return;
  }
  try {
    const userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo("username", contact.email);
    const user = await userQuery.first();
    if (user) {
      navigate(`/chat/${user.id}`);
    } else {
      alert("This contact doesn't have an account yet!");
    }
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
};

  /**
   * Effect to load contact details when the component mounts or when the ID changes.
   */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErrorMsg("");
        const data = await getContactById(id);
        if (!cancelled) setContact(data);
      } catch (err) {
        if (!cancelled) setErrorMsg(err?.message ?? "Failed to load contact");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  /**
   * Render loading, error, or contact details based on the current state.
   */
  if (loading) return <p>Loading…</p>;
  if (errorMsg) return <p style={{ color: "crimson" }}>{errorMsg}</p>;
  if (!contact) return <p>Contact not found.</p>;

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">← Back</Link>
      <h1 style={{ marginTop: 12 }}>{contact.name || "Contact"}</h1>

      <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
        <div><b>Phone:</b> {contact.phoneNumber || "—"}</div>
        <div><b>Email:</b> {contact.email || "—"}</div>
        <div><b>Service Locations:</b> {contact.serviceLocations?.length ? contact.serviceLocations.join(", ") : "—"}</div>
        <button onClick={handleMessage}>Message</button>
      </div>
    </div>
  );
}