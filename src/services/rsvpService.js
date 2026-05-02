import Parse from "./parseClient";

export async function toggleRsvp(taskId, userId, isCurrentlyRsvpd) {
  const task = new Parse.Object("Tasks");
  task.id = taskId;

  const userRef = Parse.User.createWithoutData(userId);
  if (isCurrentlyRsvpd) {
    task.remove("rsvps", userRef);
  } else {
    task.addUnique("rsvps", userRef);
  }

  return task.save();
}
