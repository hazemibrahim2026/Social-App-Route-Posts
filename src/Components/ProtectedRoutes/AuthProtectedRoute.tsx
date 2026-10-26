import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router';
import { TokenContext } from '../Context/tokenContext';

export default function AuthProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
    const token = useContext(TokenContext)?.token;
      const navigate = useNavigate();
    
      useEffect(() => {
        if (token) {
          navigate("/feed");
        }
      }, [token, navigate]);
  return (
    <>{children}</>
  )
}
