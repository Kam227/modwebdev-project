import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Parse from "../services/parseClient";

const MAX_LOCATION = 100;
const MAX_BIO = 300;

const btnEdit = {
  background: "none", border: "1.5px solid #0a66c2", color: "#0a66c2",
  borderRadius: 20, padding: "5px 16px", fontSize: 13, fontWeight: 600,
  cursor: "pointer", fontFamily: "inherit",
};
const btnSave = {
  background: "#0a66c2", color: "#fff", border: "none",
  borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600,
  cursor: "pointer", fontFamily: "inherit",
};
const btnCancel = {
  background: "none", border: "1.5px solid #ccc", color: "#555",
  borderRadius: 8, padding: "8px 18px", fontSize: 13,
  cursor: "pointer", fontFamily: "inherit",
};
const btnRemove = {
  background: "#fee2e2", border: "none", color: "#dc2626",
  borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 500,
  cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
};

function Card({ title, action, children }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 10, padding: "20px 28px",
      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)", marginBottom: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function Profile() {
  const current = Parse.User.current();
  const { id } = useParams();
  const navigate = useNavigate();
  const isOwnProfile = !id || id === current.id;

  const [profileUser, setProfileUser] = useState(isOwnProfile ? current : null);
  const [loadingProfile, setLoadingProfile] = useState(!isOwnProfile);

  // All certificates in DB — used for the "add" dropdown
  const [allCerts, setAllCerts] = useState([]);
  const [showCertDropdown, setShowCertDropdown] = useState(false);

  // Edit states — own profile only
  const [editBio, setEditBio] = useState(false);
  const [bioVal, setBioVal] = useState(current.get("bio") || "");
  const [editLocation, setEditLocation] = useState(false);
  const [locationVal, setLocationVal] = useState(current.get("preferredLocation") || "");
  const [editExp, setEditExp] = useState(false);
  const [expVal, setExpVal] = useState(current.get("experience") || []);
  const [newExpVal, setNewExpVal] = useState("");

  // Make the page span the full screen (same approach as Messaging)
  useEffect(() => {
    const root = document.getElementById("root");
    root?.classList.add("fullscreen");
    return () => root?.classList.remove("fullscreen");
  }, []);

  useEffect(() => {
    if (isOwnProfile) { setProfileUser(current); return; }
    setLoadingProfile(true);
    new Parse.Query(Parse.User).get(id)
      .then(setProfileUser)
      .catch(() => setProfileUser(null))
      .finally(() => setLoadingProfile(false));
  }, [id]);

  // Fetch all Certificates from DB once
  useEffect(() => {
    const query = new Parse.Query("Certificates");
    query.limit(200);
    query.find()
      .then((results) => setAllCerts(results.map((c) => ({
        id: c.id,
        name: c.get("Name") || "",
        organization: c.get("IssuingOrganization") || "",
        specialty: c.get("Specialty") || "",
        hours: c.get("Hours") ?? null,
      }))))
      .catch(() => setAllCerts([]));
  }, []);

  const saveBio = async () => {
    current.set("bio", bioVal);
    await current.save();
    setEditBio(false);
  };

  const saveLocation = async () => {
    current.set("preferredLocation", locationVal);
    await current.save();
    setEditLocation(false);
  };

  const saveExp = async () => {
    current.set("experience", expVal);
    await current.save();
    setEditExp(false);
  };

  const addExp = () => {
    if (!newExpVal.trim()) return;
    setExpVal((prev) => [...prev, newExpVal.trim()]);
    setNewExpVal("");
  };

  const addCert = async (certId) => {
    const existing = current.get("certificate") || [];
    if (existing.includes(certId)) return;
    const updated = [...existing, certId];
    current.set("certificate", updated);
    await current.save();
    setProfileUser(current);
    setShowCertDropdown(false);
  };

  const removeCert = async (certId) => {
    const updated = (current.get("certificate") || []).filter((c) => c !== certId);
    current.set("certificate", updated);
    await current.save();
    setProfileUser(current);
  };

  if (loadingProfile) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!profileUser) return <p style={{ padding: 24 }}>User not found.</p>;

  const fullName = `${profileUser.get("firstName") || ""} ${profileUser.get("lastName") || ""}`.trim();
  const initials = fullName.split(" ").map((w) => w[0]).filter(Boolean).join("").toUpperCase().slice(0, 2);
  const bio = profileUser.get("bio") || "";
  const location = profileUser.get("preferredLocation") || "";
  const experience = profileUser.get("experience") || [];

  // Certificates this user has linked (stored as objectIds in their "certificate" array)
  const linkedCertIds = profileUser.get("certificate") || [];
  const linkedCerts = allCerts.filter((c) => linkedCertIds.includes(c.id));
  const availableCerts = allCerts.filter((c) => !linkedCertIds.includes(c.id));

  return (
    <div style={{ minHeight: "100vh", background: "#f3f2ef", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px 48px" }}>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: 14, padding: "8px 0 14px", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}
        >
          ← Back
        </button>

        {/* Header card */}
        <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 0 0 1px rgba(0,0,0,0.08)", marginBottom: 10 }}>
          <div style={{ height: 120, background: "linear-gradient(135deg, #4A90E2 0%, #7B5EA7 100%)" }} />
          <div style={{ padding: "0 28px 24px", position: "relative" }}>
            <div style={{
              width: 96, height: 96, borderRadius: "50%",
              background: "#4A90E2", border: "4px solid #fff",
              position: "absolute", top: -48,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 34, color: "#fff", fontWeight: 700,
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            }}>
              {initials}
            </div>
            <div style={{ paddingTop: 58, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>{fullName || "—"}</h1>
                {location && (
                  <span style={{ fontSize: 14, color: "#666", display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {location}
                  </span>
                )}
              </div>
              {!isOwnProfile && (
                <button
                  onClick={() => navigate(`/chat/${id}`)}
                  style={{ ...btnSave, borderRadius: 20, padding: "9px 24px", fontSize: 14 }}
                >
                  Message
                </button>
              )}
            </div>
          </div>
        </div>

        {/* About */}
        <Card
          title="About"
          action={isOwnProfile && !editBio && (
            <button style={btnEdit} onClick={() => setEditBio(true)}>Edit</button>
          )}
        >
          {editBio ? (
            <div>
              <textarea
                value={bioVal}
                onChange={(e) => setBioVal(e.target.value.slice(0, MAX_BIO))}
                placeholder="Write a short bio..."
                style={{
                  width: "100%", minHeight: 110, padding: "10px 12px",
                  borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14,
                  resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
                  lineHeight: 1.6, outline: "none",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ fontSize: 12, color: "#999" }}>{bioVal.length} / {MAX_BIO}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={btnCancel} onClick={() => { setBioVal(current.get("bio") || ""); setEditBio(false); }}>Cancel</button>
                  <button style={btnSave} onClick={saveBio}>Save</button>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: 15, color: bio ? "#333" : "#999", lineHeight: 1.7 }}>
              {bio || (isOwnProfile ? "Add a bio to tell people about yourself." : "No bio yet.")}
            </p>
          )}
        </Card>

        {/* Preferred Location — own profile only */}
        {isOwnProfile && (
          <Card
            title="Preferred Work Location"
            action={!editLocation && (
              <button style={btnEdit} onClick={() => setEditLocation(true)}>Edit</button>
            )}
          >
            {editLocation ? (
              <div>
                <input
                  value={locationVal}
                  onChange={(e) => setLocationVal(e.target.value.slice(0, MAX_LOCATION))}
                  placeholder="e.g. South Bend, IN"
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 8,
                    border: "1.5px solid #ddd", fontSize: 14,
                    boxSizing: "border-box", fontFamily: "inherit", outline: "none",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: "#999" }}>{locationVal.length} / {MAX_LOCATION}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={btnCancel} onClick={() => { setLocationVal(current.get("preferredLocation") || ""); setEditLocation(false); }}>Cancel</button>
                    <button style={btnSave} onClick={saveLocation}>Save</button>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 15, color: location ? "#333" : "#999" }}>
                {location || "Add your preferred work location."}
              </p>
            )}
          </Card>
        )}

        {/* Experience */}
        <Card
          title="Experience"
          action={isOwnProfile && (
            editExp ? (
              <div style={{ display: "flex", gap: 8 }}>
                <button style={btnCancel} onClick={() => { setExpVal(current.get("experience") || []); setEditExp(false); }}>Cancel</button>
                <button style={btnSave} onClick={saveExp}>Save</button>
              </div>
            ) : (
              <button style={btnEdit} onClick={() => setEditExp(true)}>Edit</button>
            )
          )}
        >
          {!editExp ? (
            experience.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {experience.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 8, background: "#f0f4ff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20, flexShrink: 0,
                    }}>💼</div>
                    <div style={{ paddingTop: 4 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>{item}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 15, color: "#999" }}>
                {isOwnProfile ? "Add your work experience." : "No experience listed."}
              </p>
            )
          ) : (
            <div>
              {expVal.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input
                    value={item}
                    onChange={(e) => { const u = [...expVal]; u[i] = e.target.value; setExpVal(u); }}
                    style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", outline: "none" }}
                  />
                  <button style={btnRemove} onClick={() => setExpVal(expVal.filter((_, idx) => idx !== i))}>Remove</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input
                  value={newExpVal}
                  onChange={(e) => setNewExpVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addExp()}
                  placeholder="Add a job or experience..."
                  style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", outline: "none" }}
                />
                <button style={btnSave} onClick={addExp}>Add</button>
              </div>
            </div>
          )}
        </Card>

        {/* Certifications */}
        <Card
          title="Certifications"
          action={isOwnProfile && availableCerts.length > 0 && (
            <button style={btnEdit} onClick={() => setShowCertDropdown((v) => !v)}>
              + Add
            </button>
          )}
        >
          {/* Dropdown to pick a certificate from the DB */}
          {showCertDropdown && (
            <div style={{
              border: "1.5px solid #e0e0e0", borderRadius: 8, marginBottom: 16,
              overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}>
              {availableCerts.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => addCert(cert.id)}
                  style={{ padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #f0f0f0", fontSize: 14 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f9ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  <div style={{ fontWeight: 600, color: "#1a1a1a" }}>{cert.name}</div>
                  {cert.organization && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{cert.organization}</div>}
                </div>
              ))}
            </div>
          )}

          {linkedCerts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {linkedCerts.map((cert) => (
                <div key={cert.id} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 8, background: "#eff6ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, flexShrink: 0,
                  }}>🏅</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>{cert.name}</div>
                    {cert.organization && <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>{cert.organization}</div>}
                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                      {cert.specialty && (
                        <span style={{ fontSize: 12, background: "#f0f4ff", color: "#0a66c2", borderRadius: 20, padding: "2px 10px", fontWeight: 500 }}>
                          {cert.specialty}
                        </span>
                      )}
                      {cert.hours != null && (
                        <span style={{ fontSize: 12, background: "#f0fdf4", color: "#16a34a", borderRadius: 20, padding: "2px 10px", fontWeight: 500 }}>
                          {cert.hours}h
                        </span>
                      )}
                    </div>
                  </div>
                  {isOwnProfile && (
                    <button style={{ ...btnRemove, padding: "6px 12px", fontSize: 12 }} onClick={() => removeCert(cert.id)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: 15, color: "#999" }}>
              {isOwnProfile ? "No certifications added yet. Click \"+ Add\" to link one." : "No certifications listed."}
            </p>
          )}
        </Card>

      </div>
    </div>
  );
}
