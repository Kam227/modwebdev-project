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

<<<<<<< HEAD
function toCertificateDTO(obj) {
  if (!obj) return null;
  const json = obj.toJSON();
  // Strip Parse internal fields
  const { objectId, createdAt, updatedAt, __type, className, ...fields } = json;
  return { id: obj.id, ...fields };
}

function toTaskDTO(obj) {
  return {
    id: obj.id,
    certificateAid: toCertificateDTO(obj.get("CertificateAid")),
=======
function toTaskDTO(obj) {
  return {
    id: obj.id,
    certificateAid: obj.get("CertificateAid") ?? null,
>>>>>>> 29149abfe59fc08576d8539012df717301e29475
    trainingNeeded: obj.get("trainingNeeded") ?? null,
    description: obj.get("Description") ?? "",
    location: obj.get("Location") ?? "",
    openings: obj.get("Openings") ?? null,
    contact: toContactDTO(obj.get("contact")),
<<<<<<< HEAD
    latitude: obj.get("Latitude") ?? null,
    longitude: obj.get("Longitude") ?? null,
=======
>>>>>>> 29149abfe59fc08576d8539012df717301e29475
  };
}

export async function getTasks({ limit = 50 } = {}) {
  const query = new Parse.Query("Tasks");
  query.limit(limit);
  query.include("contact");
<<<<<<< HEAD
  query.include("CertificateAid");

  const results = await query.find({ useMasterKey: false });
=======

  const results = await query.find();
>>>>>>> 29149abfe59fc08576d8539012df717301e29475
  return results.map(toTaskDTO);
}