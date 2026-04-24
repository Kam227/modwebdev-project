import Parse from "./parseClient";

export const sendMessage = async (text, receiverId) => {
  const Message = Parse.Object.extend("Message");
  const msg = new Message();
  msg.set("text", text);
  msg.set("sender", Parse.User.current());
  msg.set("receiver", { __type: "Pointer", className: "_User", objectId: receiverId });
  msg.set("read", false);

  const acl = new Parse.ACL();
  acl.setReadAccess(Parse.User.current().id, true);
  acl.setWriteAccess(Parse.User.current().id, true);
  acl.setReadAccess(receiverId, true);
  acl.setWriteAccess(receiverId, true);
  msg.setACL(acl);

  return await msg.save();
};

export const getUnreadCount = async () => {
  const current = Parse.User.current();
  const query = new Parse.Query("Message");
  query.equalTo("receiver", current);
  query.equalTo("read", false);
  return await query.count();
};

export const markConversationRead = async (otherUserId) => {
  const current = Parse.User.current();
  const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
  const MASTER_KEY = import.meta.env.VITE_PARSE_MASTER_KEY;
  const BASE = "https://parseapi.back4app.com";

  const where = encodeURIComponent(JSON.stringify({
    receiver: { __type: "Pointer", className: "_User", objectId: current.id },
    sender:   { __type: "Pointer", className: "_User", objectId: otherUserId },
  }));

  const res = await fetch(`${BASE}/classes/Message?where=${where}&limit=100`, {
    headers: {
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-Master-Key": MASTER_KEY,
    },
  });
  const { results } = await res.json();
  if (!results?.length) return;

  await Promise.all(results.map((msg) =>
    fetch(`${BASE}/classes/Message/${msg.objectId}`, {
      method: "PUT",
      headers: {
        "X-Parse-Application-Id": APP_ID,
        "X-Parse-Master-Key": MASTER_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ read: true }),
    })
  ));
};

export const subscribeToIncoming = async (onNew) => {
  const current = Parse.User.current();
  const query = new Parse.Query("Message");
  query.equalTo("receiver", current);
  const sub = await query.subscribe();
  sub.on("create", onNew);
  return sub;
};

// Subscribes only to incoming messages for this specific conversation
export const subscribeToMessages = async (otherUserId, onNewMessage) => {
  const current = Parse.User.current();
  const query = new Parse.Query("Message");
  query.equalTo("receiver", current);
  query.equalTo("sender", { __type: "Pointer", className: "_User", objectId: otherUserId });
  const subscription = await query.subscribe();
  subscription.on("create", (message) => {
    onNewMessage(message);
  });
  return subscription;
};

export const getConversations = async () => {
  const current = Parse.User.current();

  const sentQuery = new Parse.Query("Message");
  sentQuery.equalTo("sender", current);
  sentQuery.include("receiver");
  sentQuery.descending("createdAt");

  const receivedQuery = new Parse.Query("Message");
  receivedQuery.equalTo("receiver", current);
  receivedQuery.include("sender");
  receivedQuery.descending("createdAt");

  const [sent, received] = await Promise.all([sentQuery.find(), receivedQuery.find()]);

  const allMessages = [...sent, ...received].sort((a, b) => b.createdAt - a.createdAt);

  const convMap = new Map();
  for (const msg of allMessages) {
    const isSent = msg.get("sender").id === current.id;
    const other = isSent ? msg.get("receiver") : msg.get("sender");
    if (other && !convMap.has(other.id)) {
      convMap.set(other.id, { user: other, lastMessage: msg, isSent });
    }
  }

  return Array.from(convMap.values());
};
