import { createContext, useState } from "react";
import { getUserSession } from "./utils";

type ContextProps = {
  children: React.ReactNode;
};

type userSession = {
  token: string;
  userId: string;
  tokenExpiration: number;
};

type ContextValues = {
  userSession: userSession | null;
  setUserSession: ({}: userSession | null) => void;
};

export const Context = createContext<ContextValues>({
  userSession: null,
  setUserSession: () => {},
});

export const ContextProvider = ({ children }: ContextProps) => {
  const [userSession, setUserSession] = useState<null | userSession>(getUserSession());

  const contextValue: ContextValues = {
    userSession: userSession,
    setUserSession: setUserSession,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
