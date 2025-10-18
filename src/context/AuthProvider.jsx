import { createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  return (
    <AuthContext.Provider>
        { children }
    </AuthContext.Provider>
  )
}

export { AuthProvider };

export default AuthContext;