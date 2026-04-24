import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Parse from "../services/parseClient";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadContacts = async () => {
      const query = new Parse.Query("ContactInfo");
      const results = await query.find();
      setContacts(results);
    };

    loadContacts();
  }, []);


  return (
    <div>
      <h2>Contacts</h2>
      {contacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => handleContactClick(contact)}
          style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ccc" }}
        >
          <p>{contact.get("name")}</p>
          <p style={{ fontSize: "0.8rem", color: "gray" }}>{contact.get("email")}</p>
        </div>
      ))}
    </div>
  );
};

export default ContactList;