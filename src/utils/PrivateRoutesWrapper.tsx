import { Navigate } from "react-router-dom";

interface PrivateRoutesWrapperProps {
  element: React.ComponentType;
  isAuthenticated: boolean;
}

const PrivateRoutesWrapper = ({ element: Component, isAuthenticated }: PrivateRoutesWrapperProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Component />;
};

export default PrivateRoutesWrapper;
