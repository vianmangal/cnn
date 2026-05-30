import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

const TOKEN_KEY = "token";

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const user = useMemo(() => {
    if (!token) {
      return null;
    }
    const payload = decodeJwt(token);
    return payload ? { id: payload.sub } : { id: "unknown" };
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
