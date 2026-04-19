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
        await current.save();
        setEditLoca(false);
        setEditBio(false);
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
{/*Experience */}
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
    <h2 style={{ margin: 0 }}>Experience</h2>

    {!editBio ? ( isOwnProfile  && <button onClick={() => setEditBio(true)}>Edit</button>
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
    </div>
  );
}



      // {/* Bio */}
      // <div style={{ display: "flex",
      // flexDirection: "column",
      // alignItems: "left",
      // paddingTop: 0, textAlign: "left", marginTop: 0, width: "100%", maxWidth: 600 }}>
      //   <h2>Biography: </h2>
      //   <p style= {{paddingTop: 0}}> {current.get("Bio")||"Not provided"} this will be editable.</p>
      // </div>
//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       try {
//         setLoading(true);
//         setErrorMsg("");
//         const data = await getContactById(id);
//         if (!cancelled) setContact(data);
//       } catch (err) {
//         if (!cancelled) setErrorMsg(err?.message ?? "Failed to load contact");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [id]);

//   /**
//    * Render loading, error, or contact details based on the current state.
//    */
//   if (loading) return <p>Loading…</p>;
//   if (errorMsg) return <p style={{ color: "crimson" }}>{errorMsg}</p>;
//   if (!contact) return <p>Contact not found.</p>;
// */
//  // return (
//     <header>
//          <h1 style={{ marginTop: 12 }}>{User.lastName[0] || "Contact"}</h1>
//     </header>
//     <div style={{ padding: 16 }}>
//       <Link to="/">← Back</Link>
//       <h1 style={{ marginTop: 12 }}>{contact.name || "Contact"}</h1>

//       <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
//         <div><b>Phone:</b> {contact.phoneNumber || "—"}</div>
//         <div><b>Email:</b> {contact.email || "—"}</div>
//         <div><b>Service Locations:</b> {contact.serviceLocations || "—"}</div>
//       </div>
//     </div>
//   //);
// //}