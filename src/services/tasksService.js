import Parse from "./parseClient";

function toContactDTO(obj) {
  if (!obj) return null;

  return {
    id: obj.id,
    name: obj.get("Name") ?? "",
    phoneNumber: obj.get("PhoneNumber") ?? "",
    email: obj.get("Email") ?? "",
    serviceLocations: obj.get("ServiceLocations") ?? "",
  };
}

function toCertificateDTO(obj) {
  if (!obj) return null;
  const json = obj.toJSON();
  const { objectId, createdAt, updatedAt, __type, className, ...fields } = json;
  return { id: obj.id, ...fields };
}

function toTaskDTO(obj) {
  return {
    id: obj.id,
    certificateAid: toCertificateDTO(obj.get("CertificateAid")),
    trainingNeeded: obj.get("trainingNeeded") ?? null,
    description: obj.get("Description") ?? "",
    location: obj.get("Location") ?? "",
    openings: obj.get("Openings") ?? null,
    contact: toContactDTO(obj.get("contact")),
    latitude: obj.get("Latitude") ?? null,
    longitude: obj.get("Longitude") ?? null,
  };
}

export async function getTasks({ limit = 50 } = {}) {
  const query = new Parse.Query("Tasks");
  query.limit(limit);
  query.include("contact");
  query.include("CertificateAid");

  const results = await query.find({ useMasterKey: false });
  return results.map(toTaskDTO);
}
