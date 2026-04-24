import Parse from "./parseClient";

function toContactDTO(obj) {
  return {
    id: obj.id,
    name: obj.get("Name") ?? "",
    phoneNumber: obj.get("PhoneNumber") ?? "",
    email: obj.get("Email") ?? "",
    serviceLocations: obj.get("ServiceLocations") ?? [],
    userId: obj.get("contact")?.id ?? null,
  };
}

export async function getContactById(id) {
  const query = new Parse.Query("ContactInfo");
  query.include("user");
  const obj = await query.get(id);
  return toContactDTO(obj);
}