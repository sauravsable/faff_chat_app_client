import { useState } from "react";
import Chat from "../../components/Chat/Chat";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./User.css";

interface User {
  _id: string;
  name: string;
  email: string;
}

const User: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      <Header />
      <div className="user-container">
        <div className="sidebar">
          <Sidebar onSelectUser={setSelectedUser} />
        </div>

        <div className="chat-box">
          {selectedUser ? (
            <Chat receiver={selectedUser} />
          ) : (
            <div className="no-chat-selected">
              <p>Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default User;
