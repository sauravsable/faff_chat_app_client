import "./Sidebar.css";
import profileImage from "../../assets/Profile.png";
import { useQuery } from "@tanstack/react-query";
import { getAllUsersApi } from "../../utils/api";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface UserItemProps {
  member: User;
  onSelect: (member: User) => void;
}

const UserItem: React.FC<UserItemProps> = ({ member, onSelect }) => (
  <div className="userDetaildiv">
    <img
      className="userDetailImage"
      src={profileImage}
      alt={`${member?.name || "User"}'s avatar`}
    />
    <div className="userDetailInfo">
      <span>{member?.name}</span>
    </div>
    <button className="selectBtn" onClick={() => onSelect(member)}>
      Select
    </button>
    <div></div>
  </div>
);

interface SidebarProps {
  onSelectUser: (user: User) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectUser }) => {
  const { data, isLoading, error } = useQuery<{ users: User[] }>({
    queryKey: ["allUsers"],
    queryFn: getAllUsersApi,
  });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error fetching users</div>;

  const users = data?.users || [];

  return (
    <div className="adduserdiv">
      <div className="headingdiv">
        <h2 className="homeheading" style={{ textTransform: "capitalize" }}>
          All Users
        </h2>
      </div>

      <div>
        {users.length > 0 ? (
          users.map((user) => (
            <UserItem key={user._id} member={user} onSelect={onSelectUser} />
          ))
        ) : (
          <div>No users found</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
