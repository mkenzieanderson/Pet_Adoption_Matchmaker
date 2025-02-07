import { createContext, useState, ReactNode } from "react";

interface AuthContextType {
    auth: { token?: string }
    setAuth: React.Dispatch<React.SetStateAction<{ token?: string }>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
  }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<{ token?: string}>({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;