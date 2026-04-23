import { useEffect, useState } from "react";
import Parse from "parse";
import { sendMessage, subscribeToMessages } from "../services/MessagingService";
import { useParams } from "react-router-dom";

const ChatWindow = () => {
  const { id } = useParams(); 
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // shared handler — both incoming and sent messages go through here
  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  useEffect(() => {
    let subscription;

    // 1. load existing messages on mount
    const loadMessages = async () => {
      const query = new Parse.Query("Message");
      query.ascending("createdAt");

      // get messages where you are sender OR receiver
      const sentQuery = new Parse.Query("Message");
      sentQuery.equalTo("sender", Parse.User.current());
      sentQuery.equalTo("receiver", { __type: "Pointer", className: "_User", objectId: id });

      const receivedQuery = new Parse.Query("Message");
      receivedQuery.equalTo("receiver", Parse.User.current());
      receivedQuery.equalTo("sender", { __type: "Pointer", className: "_User", objectId: id });

      const combinedQuery = Parse.Query.or(sentQuery, receivedQuery);
      combinedQuery.ascending("createdAt");

      const existing = await combinedQuery.find();
      setMessages(existing);
    };

    const setup = async () => {
      await loadMessages();
      subscription = await subscribeToMessages(handleNewMessage);
    };

    setup();

    // 4. unsubscribe on unmount
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [id]); 

  // 3. handle sending
  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(text, id, handleNewMessage);
    setText(""); // clear input after send
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign:
                msg.get("sender").id === Parse.User.current().id
                  ? "right"
                  : "left",
            }}
          >
            <p>{msg.get("text")}</p>
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatWindow;