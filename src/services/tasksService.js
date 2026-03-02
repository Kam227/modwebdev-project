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

function toTaskDTO(obj) {
  return {
    id: obj.id,

    certificateAid: obj.get("CertificateAid") ?? null,
    trainingNeeded: obj.get("trainingNeeded") ?? null,
    description: obj.get("Description") ?? "",
    location: obj.get("Location") ?? "",
    openings: obj.get("Openings") ?? null,
    contact: toContactDTO(obj.get("contact")),
  };
}

export async function getTasks({ limit = 50 } = {}) {
  const query = new Parse.Query("Tasks");
  query.limit(limit);

  query.include("contact");

  const results = await query.find();
  return results.map(toTaskDTO);
}