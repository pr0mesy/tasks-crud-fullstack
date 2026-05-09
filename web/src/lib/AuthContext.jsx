import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    setAuthError(null);
    setAppPublicSettings(null);
    setIsLoadingPublicSettings(false);
    await checkUserAuth();
  };

  const checkUserAuth = async () => {
    setIsLoadingAuth(true);

    const token = localStorage.getItem("auth_token");

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
      return null;
    }

    const userData = { token };

    setUser(userData);
    setIsAuthenticated(true);
    setIsLoadingAuth(false);
    setAuthChecked(true);

    return userData;
  };

  const login = (token) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("access_token", token);

    const userData = { token };

    setUser(userData);
    setIsAuthenticated(true);
    setAuthError(null);

    return userData;
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_token");

    if (shouldRedirect) {
      window.location.assign("/login");
    }
  };

  const navigateToLogin = () => {
    window.location.assign("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        login,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};