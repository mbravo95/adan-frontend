import { createContext } from "react";
import { useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [profile, setProfile] = useState({});
  return (
    <AuthContext.Provider
      value={{
        profile,
        setProfile
      }}
    >
        { children }
    </AuthContext.Provider>
  )
}

export { AuthProvider };

export default AuthContext;