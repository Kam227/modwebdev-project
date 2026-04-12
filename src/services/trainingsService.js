import Parse from "./parseClient";

function toTrainingDTO(obj) {
  return {
    id: obj.id,
    maxCapacity: obj.get("maxCapacity") ?? null,
    description: obj.get("Description") ?? "",
    location: obj.get("Location") ?? "",
<<<<<<< HEAD
    latitude: obj.get("Latitude") ?? null,
    longitude: obj.get("Longitude") ?? null,
=======
>>>>>>> 29149abfe59fc08576d8539012df717301e29475
  };
}

export async function getTrainings({ limit = 50 } = {}) {
  const query = new Parse.Query("Trainings");
  query.limit(limit);

<<<<<<< HEAD
  const results = await query.find({ useMasterKey: false });
=======
  const results = await query.find();
>>>>>>> 29149abfe59fc08576d8539012df717301e29475
  return results.map(toTrainingDTO);
}