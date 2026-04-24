const APP_ID     = import.meta.env.VITE_PARSE_APP_ID;
const MASTER_KEY = import.meta.env.VITE_PARSE_MASTER_KEY;
const BASE       = "https://parseapi.back4app.com";

export async function toggleRsvp(taskId, userId, isCurrentlyRsvpd) {
  const op = isCurrentlyRsvpd
    ? { __op: "Remove",    objects: [{ __type: "Pointer", className: "_User", objectId: userId }] }
    : { __op: "AddUnique", objects: [{ __type: "Pointer", className: "_User", objectId: userId }] };

  const res = await fetch(`${BASE}/classes/Tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-Master-Key":     MASTER_KEY,
      "Content-Type":           "application/json",
    },
    body: JSON.stringify({ rsvps: op }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}
