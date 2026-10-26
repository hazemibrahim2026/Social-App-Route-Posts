import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { TokenContext } from "../Context/tokenContext";


export default function AppProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useContext(TokenContext)?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
    }
  }, [token, navigate]);


  return <>{children}</>;
}
