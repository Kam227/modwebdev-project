import Parse from "./parseClient";

function toHouseDTO(obj) {
  return {
    id: obj.id,
    street: obj.get("street") ?? "",
    unit: obj.get("unit") ?? "",
    city: obj.get("city") ?? "",
    state: obj.get("state") ?? "",
    zip: obj.get("zip") ?? "",
    country: obj.get("country") ?? "",
  };
}

export async function getHouses({ limit = 50 } = {}) {
  const House = Parse.Object.extend("House");
  const query = new Parse.Query(House);

  query.limit(limit);
  query.ascending("street");

  const results = await query.find();
  return results.map(toHouseDTO);
}