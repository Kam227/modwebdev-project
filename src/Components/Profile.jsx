import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
//import { saveLocation } from "../services/ProfileService";
import Parse from "parse";

// big Buge, i can edit when i search, not when i just go to my profile

export default function Profile() {
  
    const current = Parse.User.current();
    const fullName = current.get("firstName")+ " " + current.get("lastName");
    const initials = fullName.split(" ").map(word => word[0]).join("").toUpperCase();
    const [editLoca,setEditLoca] = useState(null);//controls edit mode
    const [loca,setloca] = useState(current.get("preferredLocation")||""); // controls actual input val
    const [editBio,setEditBio] = useState(null);//controls edit mode
    const [bio,setBio] = useState(current.get("bio")||""); // controls actual input val
    const [editExp,setEditExp] = useState(null);//controls edit mode
    const [exp,setExp] = useState(current.get("experience")||[]); // controls actual input val
    const [newExp, setNewExp] = useState("");
    const [editCert,setEditCert] = useState(null);//controls edit mode
    const [cert,setCert] = useState(current.get("certificate")||[]); // controls actual input val
    const [newCert, setNewCert] = useState("");
    const { id } = useParams();
    const isOwnProfile = !id || id === current.id;
    const [profileUser, setProfileUser] = useState(null);

useEffect(() => {
  async function loadUser() {
    if (id) {
      const query = new Parse.Query(Parse.User);
      const user = await query.get(id);
      setProfileUser(user);
    } else {
      setProfileUser(current);
    }
  }

  loadUser();
}, [id]);

async function save() {
      if (!isOwnProfile) return;
      try {
        current.set("preferredLocation", loca);
        current.set ("bio", bio );
        current.set("experience",exp);
        current.set("certificate",cert);
        await current.save();
        setEditLoca(false);
        setEditBio(false);
        setEditExp(false);
        setEditCert(false);
      } catch (err) {
        console.error("Error saving:", err);
      }
      }
return ( 
    <div style={{display: "flex", flexDirection: "column"}}>
      <Link style={{
        display:"flex",
        flexDirection:"revert",
        alignItems:"flex-start", 
        paddingBottom: 20}} to="/">← Back</Link> 
      {/* Initials Icon */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: "#4A90E2",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          margin: "0 auto"
        }}
      >
        {initials}
      </div>
      {/* Full Name */}
      <div style={{ marginTop: 20 }}> Hello {fullName},</div>
      {/*Achievement Badges*/}
      <div>
        <ul class="badges">
          <li> *10 Tasks Completed*</li>
          <li> *Perfect Training Attendance*</li>
        </ul>
      </div>
      {/* Preferred Location */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 16,
          width: "100%",
          maxWidth: 600,
          marginTop: 30
        }}
      >
      {/* Header row: title + edit/save/cancel */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10
        }}
      >
      <h2 style={{ margin: 0 }}>Preferred Working Location</h2>

      {!editLoca ? ( isOwnProfile && <button onClick={() => setEditLoca(true)}>Edit</button>
      ) : (
        <div>
        <button onClick={save}>Save</button>
        <button
          onClick={() => setEditLoca(false)}
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>
      </div>
    )}
  </div>

  {/* Value or Input */}
  {!editLoca ? (
    <p>{current.get("preferredLocation") || "Not provided"}</p>
  ) : (
    <input
      type="text"
      value={loca}
      onChange={(e) => setloca(e.target.value)}
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 6,
        border: "1px solid #ccc"
      }}
    />
  )}
</div>

{/*Bio */}
<div
  style={{
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 16,
    width: "100%",
    maxWidth: 600,
    marginTop: 30
  }}
>
  {/* Header row: title + edit/save/cancel */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }}
  >
    <h2 style={{ margin: 0 }}>Biography</h2>

    {!editBio ? ( isOwnProfile && <button onClick={() => setEditBio(true)}>Edit</button>
    ) : (
      <div>
        <button onClick={save}>Save</button>
        <button
          onClick={() => setEditBio(false)}
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>
      </div>
    )}
  </div>

  {/* Value or Input */}
  {!editBio ? (
    <p>{current.get("bio") || "Not provided"}</p>
  ) : (
    <input
      type="text"
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 6,
        border: "1px solid #ccc"
      }}
    />
  )}
</div>
{/* Experience */}
<div
  style={{
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 16,
    width: "100%",
    maxWidth: 600,
    marginTop: 30
  }}
>
  {/* Header row */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }}
  >
    <h2 style={{ margin: 0 }}>Experience</h2>

    {!editExp ? (
      <button onClick={() => setEditExp(true)}>Edit</button>
    ) : (
      <div>
        <button onClick={save}>Save</button>
        <button
          onClick={() => setEditExp(false)}
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>
      </div>
    )}
  </div>

  {/* Display mode: map over array */}
  {!editExp ? (
    exp.length > 0 ? (
      <ul>
        {exp.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : (
      <p>No experiences added yet.</p>
    )

  ) : (
    // Edit mode
    <div>
      {/* Existing items - each editable */}
      {exp.map((item, index) => (
        <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const updated = [...exp];
              updated[index] = e.target.value;
              setExp(updated);
            }}
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
          <button
            onClick={() => {
              const updated = exp.filter((_, i) => i !== index);
              setExp(updated);
            }}
            style={{ color: "red" }}
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add new item */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          type="text"
          value={newExp}
          onChange={(e) => setNewExp(e.target.value)}
          placeholder="Add new experience..."
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={() => {
            if (newExp.trim()) {
              setExp([...exp, newExp.trim()]);
              setNewExp("");
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  )}
</div>
{/* certifications */}
<div
  style={{
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 16,
    width: "100%",
    maxWidth: 600,
    marginTop: 30
  }}
>
  {/* Header row */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }}
  >
    <h2 style={{ margin: 0 }}>Certifications</h2>

    {!editCert ? (
      <button onClick={() => setEditCert(true)}>Edit</button>
    ) : (
      <div>
        <button onClick={save}>Save</button>
        <button
          onClick={() => setEditCert(false)}
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>
      </div>
    )}
  </div>

  {/* Display mode: map over array */}
  {!editCert ? (
    cert.length > 0 ? (
      <ul>
        {cert.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : (
      <p>No certifications added yet.</p>
    )

  ) : (
    // Edit mode
    <div>
      {/* Existing items - each editable */}
      {cert.map((item, index) => (
        <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const updated = [...cert];
              updated[index] = e.target.value;
              setCert(updated);
            }}
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
          <button
            onClick={() => {
              const updated = cert.filter((_, i) => i !== index);
              setCert(updated);
            }}
            style={{ color: "red" }}
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add new item */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          type="text"
          value={newCert}
          onChange={(e) => setNewCert(e.target.value)}
          placeholder="Add new accomplishment..."
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={() => {
            if (newCert.trim()) {
              setCert([...cert, newCert.trim()]);
              setNewCert("");
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  )}
</div>
    </div>
  );
}