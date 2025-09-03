import { useEffect } from "react";
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

  useEffect(() => {
    const header = document.querySelector(".fixed-top");
    const handleScroll = () => {
      if (!header) return;
      if (window.scrollY > 45) {
        header.classList.add("bg-white", "shadow");
        if (window.innerWidth >= 992)
          header.setAttribute("style", "top:-45px;");
      } else {
        header.classList.remove("bg-white", "shadow");
        if (window.innerWidth >= 992) header.setAttribute("style", "top:0;");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
