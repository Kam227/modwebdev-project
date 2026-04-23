import Parse from "./parse"; // your existing parse config file

export const sendMessage = async (text, receiverId, onNewMessage) => {
  const Message = Parse.Object.extend("Message");
  const msg = new Message();
  msg.set("text", text);
  msg.set("sender", Parse.User.current());
  msg.set("receiver", { __type: "Pointer", className: "_User", objectId: receiverId });
  const saved = await msg.save();
  onNewMessage(saved); // optimistically add your own sent message to the UI
  return saved;
};

export const subscribeToMessages = async (onNewMessage) => {
  const query = new Parse.Query("Message");
  query.equalTo("receiver", Parse.User.current());
  query.ascending("createdAt");
  const subscription = await query.subscribe();
  subscription.on("create", (message) => {
    onNewMessage(message); // callback to update your UI
  })
  return subscription; // return it so the component can unsubscribe
};