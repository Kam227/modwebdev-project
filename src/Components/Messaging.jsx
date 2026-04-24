import { useEffect, useState, useRef } from "react";
import Parse from "../services/parseClient";
import { sendMessage, subscribeToMessages, markConversationRead } from "../services/MessagingService";
import { useParams, useNavigate } from "react-router-dom";

const ChatWindow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const current = Parse.User.current();

  const addMessage = (msg) => {
    setMessages((prev) =>
      prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
    );
  };

  useEffect(() => {
    const root = document.getElementById("root");
    root?.classList.add("fullscreen");
    return () => root?.classList.remove("fullscreen");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let subscription;

    const setup = async () => {
      const userQuery = new Parse.Query(Parse.User);
      const user = await userQuery.get(id);
      setOtherUser(user);

      const sentQuery = new Parse.Query("Message");
      sentQuery.equalTo("sender", { __type: "Pointer", className: "_User", objectId: current.id });
      sentQuery.equalTo("receiver", { __type: "Pointer", className: "_User", objectId: id });

      const receivedQuery = new Parse.Query("Message");
      receivedQuery.equalTo("receiver", { __type: "Pointer", className: "_User", objectId: current.id });
      receivedQuery.equalTo("sender", { __type: "Pointer", className: "_User", objectId: id });

      const combinedQuery = Parse.Query.or(sentQuery, receivedQuery);
      combinedQuery.ascending("createdAt");
      const existing = await combinedQuery.find();
      setMessages(existing);

      await markConversationRead(id);
      subscription = await subscribeToMessages(id, (msg) => {
        addMessage(msg);
        markConversationRead(id);
      });
    };

    setup();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [id]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const saved = await sendMessage(text.trim(), id);
    addMessage(saved);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const otherName = otherUser
    ? `${otherUser.get("firstName") || ""} ${otherUser.get("lastName") || ""}`.trim() || otherUser.get("username")
    : "Loading...";

  const getInitial = (user) =>
    user?.get("firstName")?.[0]?.toUpperCase() ?? "?";

  const getDisplayName = (msg) => {
    const isOwn = msg.get("sender").id === current.id;
    if (isOwn) {
      const fn = current.get("firstName") || "";
      const ln = current.get("lastName") || "";
      return `${fn} ${ln}`.trim() || current.get("username");
    }
    return otherName;
  };

  const shouldShowHeader = (msg, index) => {
    if (index === 0) return true;
    const prev = messages[index - 1];
    return prev.get("sender").id !== msg.get("sender").id;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%", background: "#313338" }}>
      {/* Header */}
      <div style={{
        background: "#2b2d31",
        padding: "0 16px",
        height: 48,
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: "1px solid #1e1f22",
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#b5bac1",
            fontSize: 18,
            cursor: "pointer",
            padding: "4px 8px 4px 0",
            lineHeight: 1,
          }}
        >
          ←
        </button>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "#5865f2",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 14,
          flexShrink: 0,
        }}>
          {getInitial(otherUser)}
        </div>
        <span style={{ fontWeight: 600, fontSize: 15, color: "#f2f3f5" }}>{otherName}</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 0 8px" }}>
        {messages.map((msg, index) => {
          const isOwn = msg.get("sender").id === current.id;
          const showHeader = shouldShowHeader(msg, index);
          const senderInitial = isOwn ? getInitial(current) : getInitial(otherUser);
          const avatarColor = isOwn ? "#5865f2" : "#ed4245";

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: isOwn ? "row-reverse" : "row",
                gap: 12,
                padding: showHeader ? "16px 16px 2px" : "2px 16px",
                paddingLeft: !isOwn && !showHeader ? 68 : 16,
                paddingRight: isOwn && !showHeader ? 68 : 16,
                alignItems: "flex-start",
              }}
            >
              {showHeader && (
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: avatarColor,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 16,
                  flexShrink: 0,
                  marginTop: 2,
                }}>
                  {senderInitial}
                </div>
              )}
              <div style={{ minWidth: 0, maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start" }}>
                {showHeader && (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4, flexDirection: isOwn ? "row-reverse" : "row" }}>
                    <span style={{ fontWeight: 600, fontSize: 15, color: isOwn ? "#c9cdfb" : "#f2f3f5" }}>
                      {getDisplayName(msg)}
                    </span>
                    <span style={{ fontSize: 11, color: "#87898c" }}>
                      {new Date(msg.get("createdAt") || msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}
                <p style={{
                  margin: 0,
                  fontSize: 15,
                  color: "#dbdee1",
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                  background: isOwn ? "#5865f2" : "#3f4147",
                  padding: "8px 12px",
                  borderRadius: isOwn ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  display: "inline-block",
                }}>
                  {msg.get("text")}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "0 16px 24px", flexShrink: 0 }}>
        <div style={{
          background: "#383a40",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
        }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message @${otherName}`}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontSize: 15,
              color: "#dbdee1",
              padding: "12px 0",
              caretColor: "#dbdee1",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            style={{
              background: "none",
              border: "none",
              color: text.trim() ? "#5865f2" : "#4e5058",
              cursor: text.trim() ? "pointer" : "default",
              fontSize: 20,
              padding: 4,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
