import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginSignup from "./pages/Login/LoginSignup";
import User from "./pages/User/User";
import { userAuthApi } from "./utils/api";
import PublicRoutesWrapper from "./utils/PublicRoutesWrapper";
import PrivateRoutesWrapper from "./utils/PrivateRoutesWrapper";

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: userAuthApi,
    retry: false,
  });

  const isAuthenticated = !isError && (data?.isAuthenticated ?? false);

  if (isLoading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoutesWrapper
              element={LoginSignup}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoutesWrapper
              element={User}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="*"
          element={
            <PublicRoutesWrapper
              element={LoginSignup}
              isAuthenticated={isAuthenticated}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
