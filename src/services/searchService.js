import Parse from "./parseClient";

export async function searchAll(term) {
  const t = term.trim();
  if (!t) return { tasks: [], trainings: [], users: [] };

  const currentUser = Parse.User.current();

  // Tasks
  const taskQuery = new Parse.Query("Tasks");
  taskQuery.matches("Description", t, "i");
  taskQuery.include("contact");
  taskQuery.include("contact.contact");
  taskQuery.limit(6);

  // Trainings
  const trainingQuery = new Parse.Query("Trainings");
  trainingQuery.matches("Description", t, "i");
  trainingQuery.limit(6);

  // Users — search _User by firstName OR lastName, exclude self
  const firstNameQuery = new Parse.Query(Parse.User);
  firstNameQuery.matches("firstName", t, "i");
  const lastNameQuery = new Parse.Query(Parse.User);
  lastNameQuery.matches("lastName", t, "i");
  const userQuery = Parse.Query.or(firstNameQuery, lastNameQuery);
  userQuery.limit(20);

  const [taskResults, trainingResults, userResults] = await Promise.all([
    taskQuery.find(),
    trainingQuery.find(),
    userQuery.find().catch(() => []),
  ]);

  const filteredUsers = userResults.filter((u) => u.id !== currentUser.id);

  return {
    tasks: taskResults.map((obj) => {
      const contact = obj.get("contact");
      return {
        id: obj.id,
        description: obj.get("Description") ?? "",
        location: obj.get("Location") ?? "",
        openings: obj.get("Openings") ?? null,
        trainingNeeded: obj.get("trainingNeeded") ?? null,
        certificateAid: obj.get("CertificateAid") ?? null,
        latitude: obj.get("Latitude") ?? null,
        longitude: obj.get("Longitude") ?? null,
        contact: contact
          ? {
              id: contact.id,
              name: contact.get("Name") ?? "",
              phoneNumber: contact.get("PhoneNumber") ?? "",
              email: contact.get("Email") ?? "",
              userId: contact.get("contact")?.id ?? null,
            }
          : null,
      };
    }),
    trainings: trainingResults.map((obj) => ({
      id: obj.id,
      description: obj.get("Description") ?? "",
      location: obj.get("Location") ?? "",
      maxCapacity: obj.get("maxCapacity") ?? null,
      latitude: obj.get("Latitude") ?? null,
      longitude: obj.get("Longitude") ?? null,
    })),
    users: filteredUsers.map((obj) => ({
      id: obj.id,
      firstName: obj.get("firstName") ?? "",
      lastName: obj.get("lastName") ?? "",
    })),
  };
}
