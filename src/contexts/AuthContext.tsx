import React, { createContext, useEffect, useState, useContext } from "react";
import { AccountDetails } from "../misc/types";
import { useQuery } from "@tanstack/react-query";
import {
  deleteLogoutAccessToken,
  deleteLogoutSession,
  getAccountDetails,
} from "../misc/tmdbAPI";

interface AuthContextType {
  sessionId: string | null;
  accessToken: string | null;
  account: AccountDetails | null;
  isLoggedIn: boolean;
  login: (sessionId: string, accessToken: string, accountId: string) => void;
  logout: () => void;
}

interface AuthDetails {
  sessionId: string;
  accessToken: string;
  accountId: string;
}

const SESSION_ID_STORAGE_KEY = "session_id";
const ACCESS_TOKEN_STORAGE_KEY = "access_token";
const ACCOUNT_ID_STORAGE_KEY = "account_id";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authDetails, setAuthDetails] = useState<AuthDetails | null>(null);

  const { data: account } = useQuery({
    enabled: !!authDetails,
    initialData: null,
    queryKey: ["account_details"],
    queryFn: async () => {
      if (!authDetails) return null;

      const { sessionId, accountId } = authDetails;
      const accountDetails = await getAccountDetails(accountId, sessionId);
      return accountDetails;
    },
  });

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_ID_STORAGE_KEY);
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const accountId = localStorage.getItem(ACCOUNT_ID_STORAGE_KEY);

    if (sessionId && accessToken && accountId) {
      setAuthDetails({ sessionId, accessToken, accountId });
    }
  }, []);

  const login = (sessionId: string, accessToken: string, accountId: string) => {
    localStorage.setItem(SESSION_ID_STORAGE_KEY, sessionId);
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(ACCOUNT_ID_STORAGE_KEY, accountId);
    setAuthDetails({ sessionId, accessToken, accountId });
  };

  const logout = async () => {
    if (authDetails) {
      await deleteLogoutSession(authDetails?.sessionId);
      await deleteLogoutAccessToken(authDetails?.accessToken);
      localStorage.removeItem(SESSION_ID_STORAGE_KEY);
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      localStorage.removeItem(ACCOUNT_ID_STORAGE_KEY);
      setAuthDetails(null);
    }

    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        sessionId: authDetails?.sessionId || null,
        accessToken: authDetails?.accessToken || null,
        account,
        isLoggedIn: !!authDetails && !!account,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
