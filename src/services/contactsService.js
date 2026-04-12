import Parse from "./parseClient";

function toContactDTO(obj) {
  return {
    id: obj.id,
    name: obj.get("Name") ?? "",
    phoneNumber: obj.get("PhoneNumber") ?? "",
    email: obj.get("Email") ?? "",
    serviceLocations: obj.get("ServiceLocations") ?? "",
  };
}

export async function getContactById(id) {
  const query = new Parse.Query("ContactInfo");
  const obj = await query.get(id);
  return toContactDTO(obj);
}