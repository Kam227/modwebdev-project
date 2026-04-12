import Parse from "./parseClient";

export async function searchAll(term) {
  const t = term.trim();
  if (!t) return { tasks: [], trainings: [], users: [], contacts: [] };

  // Tasks
  const taskQuery = new Parse.Query("Tasks");
  taskQuery.matches("Description", t, "i");
  taskQuery.include("contact");
  taskQuery.limit(6);

  // Trainings
  const trainingQuery = new Parse.Query("Trainings");
  trainingQuery.matches("Description", t, "i");
  trainingQuery.limit(6);

  // Users — search firstName OR lastName
  const firstNameQuery = new Parse.Query(Parse.User);
  firstNameQuery.matches("firstName", t, "i");
  const lastNameQuery = new Parse.Query(Parse.User);
  lastNameQuery.matches("lastName", t, "i");
  const userQuery = Parse.Query.or(firstNameQuery, lastNameQuery);
  userQuery.limit(6);

  // Contacts (employers)
  const contactQuery = new Parse.Query("ContactInfo");
  contactQuery.matches("Name", t, "i");
  contactQuery.limit(6);

  const [taskResults, trainingResults, userResults, contactResults] =
    await Promise.all([
      taskQuery.find(),
      trainingQuery.find(),
      userQuery.find().catch(() => []), // may fail if Parse ACL restricts User reads
      contactQuery.find(),
    ]);

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
    users: userResults.map((obj) => ({
      id: obj.id,
      firstName: obj.get("firstName") ?? "",
      lastName: obj.get("lastName") ?? "",
      email: obj.get("email") ?? "",
    })),
    contacts: contactResults.map((obj) => ({
      id: obj.id,
      name: obj.get("Name") ?? "",
      email: obj.get("Email") ?? "",
      phoneNumber: obj.get("PhoneNumber") ?? "",
      serviceLocations: obj.get("ServiceLocations") ?? "",
    })),
  };
}
