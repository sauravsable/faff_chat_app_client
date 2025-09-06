import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAuthApi, logoutApi } from "../../utils/api";

const Header = () => {
  const queryClient = useQueryClient();
    const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: userAuthApi,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
       navigate("/"); 
    },
  });

  const isAuthenticated = data?.isAuthenticated ?? false;

  if (isLoading) return null;

  return (
    <div className="top-bar">
      <div>
        {isAuthenticated ? (
          <div className="topbar-inner">
            <p>{data?.user?.name}</p>
            <p className="logoutpaara" onClick={() => logoutMutation.mutate()}>Logout</p>
          </div>
        ) : (
          <Link to="/login">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
