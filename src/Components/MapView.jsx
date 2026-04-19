import { useState, useEffect, useRef } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import { useNavigate } from "react-router-dom";
import { getTasks } from "../services/tasksService";
import { getTrainings } from "../services/trainingsService";
import { searchAll } from "../services/searchService";
import { logoutUser } from "../services/AuthService";
import TaskModal from "./TaskModal";
import TrainingModal from "./TrainingModal";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const DEFAULT_VIEW = {
  longitude: -86.2520,
  latitude: 41.6764,
  zoom: 12,
};


export default function MapView() {
  const [viewState, setViewState] = useState(DEFAULT_VIEW);
  const [tasks, setTasks] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTasks().then((data) => {
      console.log("Raw tasks:", data);
      const withCoords = data.filter((t) => t.latitude != null && t.longitude != null);
      console.log("Tasks with coords:", withCoords);
      setTasks(withCoords);
    });
    getTrainings().then((data) => {
      console.log("Raw trainings:", data);
      const withCoords = data.filter((t) => t.latitude != null && t.longitude != null);
      console.log("Trainings with coords:", withCoords);
      setTrainings(withCoords);
    });
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchAll(searchTerm);
      setSearchResults(results);
      setShowDropdown(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function flyTo(lng, lat) {
    setViewState((v) => ({ ...v, longitude: lng, latitude: lat, zoom: 14 }));
  }

  function clearSearch() {
    setSearchTerm("");
    setSearchResults(null);
    setShowDropdown(false);
  }

  async function handleLogout() {
    await logoutUser();
    window.location.href = "/auth";
  }

  const hasResults =
    searchResults &&
    (searchResults.tasks.length ||
      searchResults.trainings.length ||
      searchResults.users.length ||
      searchResults.contacts.length);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      {/* Map */}
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="bottom-right" />

        {tasks.map((task) => (
          <Marker
            key={task.id}
            longitude={task.longitude}
            latitude={task.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedTask(task);
            }}
          >
            <Pin color="#3b82f6" label={task.description} />
          </Marker>
        ))}

        {trainings.map((training) => (
          <Marker
            key={training.id}
            longitude={training.longitude}
            latitude={training.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedTraining(training);
            }}
          >
            <Pin color="#10b981" label={training.description} />
          </Marker>
        ))}
      </Map>

      {/* Floating search bar */}
      <div
        ref={searchRef}
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(540px, calc(100vw - 120px))",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: 999,
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            padding: "10px 18px",
            gap: 10,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks, trainings, people..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchResults && setShowDropdown(true)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 15,
              background: "transparent",
              color: "#222",
            }}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              style={{
                background: "#eee",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                cursor: "pointer",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Search dropdown */}
        {showDropdown && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
              marginTop: 8,
              overflow: "hidden",
              maxHeight: 420,
              overflowY: "auto",
            }}
          >
            {!hasResults ? (
              <div style={{ padding: "18px 20px", color: "#999", fontSize: 14 }}>
                No results found
              </div>
            ) : (
              <>
                {searchResults.tasks.length > 0 && (
                  <ResultSection label="Tasks" color="#3b82f6">
                    {searchResults.tasks.map((t) => (
                      <ResultRow
                        key={t.id}
                        title={t.description || "Untitled Task"}
                        sub={t.location}
                        onClick={() => {
                          clearSearch();
                          if (t.latitude && t.longitude) flyTo(t.longitude, t.latitude);
                          const full = tasks.find((x) => x.id === t.id) ?? t;
                          setSelectedTask(full);
                        }}
                      />
                    ))}
                  </ResultSection>
                )}
                {searchResults.trainings.length > 0 && (
                  <ResultSection label="Trainings" color="#10b981">
                    {searchResults.trainings.map((t) => (
                      <ResultRow
                        key={t.id}
                        title={t.description || "Untitled Training"}
                        sub={t.location}
                        onClick={() => {
                          clearSearch();
                          if (t.latitude && t.longitude) flyTo(t.longitude, t.latitude);
                          const full = trainings.find((x) => x.id === t.id) ?? t;
                          setSelectedTraining(full);
                        }}
                      />
                    ))}
                  </ResultSection>
                )}
                {searchResults.contacts.length > 0 && (
                  <ResultSection label="Employers & Contacts" color="#f59e0b">
                    {searchResults.contacts.map((c) => (
                      <ResultRow
                        key={c.id}
                        title={c.name || "Contact"}
                        sub={c.email || c.serviceLocations}
                        onClick={() => {
                          clearSearch();
                          navigate(`/contacts/${c.id}`);
                        }}
                      />
                    ))}
                  </ResultSection>
                )}
                {searchResults.users.length > 0 && (
                  <ResultSection label="Users" color="#8b5cf6">
                    {searchResults.users.map((u) => (
                      <ResultRow
                        key={u.id}
                        title={
                          `${u.firstName} ${u.lastName}`.trim() || "User"
                        }
                        sub={u.email}
                        onClick={() => {
                          clearSearch()
                          navigate(`/profile/${u.id}`);
                        }}
                      />
                    ))}
                  </ResultSection>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "#fff",
          border: "none",
          borderRadius: 999,
          padding: "10px 20px",
          fontSize: 14,
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          zIndex: 10,
          fontWeight: 500,
          color: "#333",
        }}
      >
        Logout
      </button>

      {/* Personal profile page */}
      <button
        onClick={() => navigate("/profile/:id")}
        style={{
          position: "absolute",
          top: 20,
          right: 130,
          background: "#fff",
          border: "none",
          borderRadius: 999,
          padding: "10px 20px",
          fontSize: 14,
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          zIndex: 10,
          fontWeight: 500,
          color: "#333",
        }}
      >
        Profile
      </button>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 16,
          background: "rgba(255,255,255,0.95)",
          borderRadius: 14,
          padding: "12px 16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
          fontSize: 13,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <LegendItem color="#3b82f6" label="Task" />
        <LegendItem color="#10b981" label="Training" />
      </div>

      {/* Modals */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
      {selectedTraining && (
        <TrainingModal
          training={selectedTraining}
          onClose={() => setSelectedTraining(null)}
        />
      )}
    </div>
  );
}

function Pin({ color, label }) {
  return (
    <div
      title={label}
      style={{
        width: 26,
        height: 26,
        borderRadius: "50% 50% 50% 0",
        background: color,
        border: "2.5px solid #fff",
        cursor: "pointer",
        transform: "rotate(-45deg)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.28)",
        transition: "transform 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "rotate(-45deg) scale(1.2)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "rotate(-45deg) scale(1)")
      }
    />
  );
}

function LegendItem({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50% 50% 50% 0",
          background: color,
          border: "1.5px solid #fff",
          transform: "rotate(-45deg)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          flexShrink: 0,
        }}
      />
      <span style={{ color: "#444" }}>{label}</span>
    </div>
  );
}

function ResultSection({ label, color, children }) {
  return (
    <div>
      <div
        style={{
          padding: "10px 16px 4px",
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          color,
          borderTop: "1px solid #f0f0f0",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function ResultRow({ title, sub, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ padding: "10px 16px", cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f7f7")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ fontSize: 14, fontWeight: 500, color: "#222" }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
