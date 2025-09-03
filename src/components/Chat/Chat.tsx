import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import "./Chat.css";
import { userAuthApi } from "../../utils/api";
import profileImage from "../../assets/Profile.png";

// ---------- Types ----------
interface User {
  _id: string;
  name: string;
  email?: string;
  avatar?: { url: string };
}

interface Message {
  senderId: User;
  receiverId: string;
  text: string;
}

interface ChatProps {
  receiver: User; // selected user details
}

interface MessageItemProps {
  msg: Message;
  isCurrentUser: boolean;
}

interface ChatInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
}

// ---------- Socket ----------
const socket: Socket = io(import.meta.env.VITE_API_URL_SOCKET, {
  withCredentials: true,
});

// ---------- Components ----------
const MessageItem: React.FC<MessageItemProps> = ({ msg, isCurrentUser }) => (
  <div className={`message ${isCurrentUser ? "my-message" : "user-message"}`}>
    <img
      src={profileImage}
      alt="User Avatar"
      className="avatar"
    />
    <div className="message-content">
      <span className="message-name">{msg.senderId?.name || "Unknown"}</span>
      <span className="message-text">{msg.text}</span>
    </div>
  </div>
);

const ChatInput: React.FC<ChatInputProps> = ({ message, setMessage, sendMessage }) => (
  <div className="chat-input">
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      placeholder="Type a message..."
    />
    <button onClick={sendMessage}>Send</button>
  </div>
);

// ---------- Main Chat ----------
const Chat: React.FC<ChatProps> = ({ receiver }) => {
  const [chat, setChat] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const { data: authData, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: userAuthApi,
    retry: false,
  });

  const user: User | undefined = authData?.user;

  useEffect(() => {
    if (!user?._id || !receiver?._id) return;

    socket.emit("joinPrivateChat", {
      senderId: user._id,
      receiverId: receiver._id,
    });

    console.log("message", message);
    

    const handlePreviousMessages = (messages: Message[]) => setChat(messages);
    const handleMessage = (data: Message) => setChat((prev) => [...prev, data]);

    socket.on("previousMessages", handlePreviousMessages);
    socket.on("message", handleMessage);

    return () => {
      socket.off("previousMessages", handlePreviousMessages);
      socket.off("message", handleMessage);
    };
  }, [user, receiver]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim() || !user?._id) return;

    socket.emit("privateMessage", {
      senderId: user._id,
      receiverId: receiver._id,
      text: message,
    });

    setMessage("");
  };

  if (isLoading) return <div>Loading chat...</div>;

  return (
    <div className="chat-container">
      {/* --- Selected User Header --- */}
      <div className="chat-header">
        <img
          src={profileImage}
          alt={receiver?.name}
          className="avatar"
        />
        <div className="chat-user-info">
          <h4>{receiver?.name}</h4>
        </div>
      </div>

      {/* --- Chat Window --- */}
      <div className="chat-window">
        {chat.map((msg, index) => (
          <MessageItem
            key={index}
            msg={msg}
            isCurrentUser={msg.senderId?._id === user?._id}
          />
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* --- Input --- */}
      <ChatInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
