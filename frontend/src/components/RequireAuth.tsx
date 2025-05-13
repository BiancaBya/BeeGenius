import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
    children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default RequireAuth;
