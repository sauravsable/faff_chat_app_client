import { Navigate } from "react-router-dom";

interface PublicRoutesWrapperProps {
  element: React.ComponentType;
  isAuthenticated: boolean;
}

const PublicRoutesWrapper = ({ element: Component, isAuthenticated }: PublicRoutesWrapperProps) => {
  if (isAuthenticated) {
    return <Navigate to="/user" replace />;
  }
  return <Component />;
};

export default PublicRoutesWrapper;
