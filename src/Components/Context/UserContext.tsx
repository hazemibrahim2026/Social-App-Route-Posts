import React, { createContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { userProfileType } from '../../Types/user.types';
import { getMyProfile } from '../../Services/profile.services';
import { useAuth } from './tokenContext';

export type UserContextType = {
    userDetails: userProfileType | null;
    setUserDetails: Dispatch<SetStateAction<userProfileType | null>>;
};
export const UserContext = createContext<UserContextType | null>(null);
export default function UserContextProvider({ children }: { children: React.ReactNode }) {
    const [userDetails, setUserDetails] = useState<userProfileType | null>(null);
    const {token} = useAuth();

    async function getUserProfile() {
        try {
            const {data} = await getMyProfile();
            setUserDetails(data.data.user);
        } catch (error) {
            
        }
    }
    
    useEffect(() => {
        if(token){
            getUserProfile();
        }
    }, [token]);

  return (
    <>
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
    </>
  )
}
