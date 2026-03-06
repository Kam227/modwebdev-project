import Parse from "./parseClient";

function toTrainingDTO(obj) {
  return {
    id: obj.id,
    maxCapacity: obj.get("maxCapacity") ?? null,
    description: obj.get("Description") ?? "",
    location: obj.get("Location") ?? "",
  };
}

export async function getTrainings({ limit = 50 } = {}) {
  const query = new Parse.Query("Trainings");
  query.limit(limit);

  const results = await query.find();
  return results.map(toTrainingDTO);
}