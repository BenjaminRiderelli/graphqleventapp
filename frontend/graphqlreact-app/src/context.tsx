import { createContext, useState } from "react";

type ContextProps = {
  children: React.ReactNode;
};

type ContextValues = {
  token: string;
  setToken: (newToken: string) => void;
};

export const Context = createContext<ContextValues>({
  token: "",
  setToken: () => {},
});

export const ContextProvider = ({ children }: ContextProps) => {
  const [token, setToken] = useState<string>("");

  const contextValue: ContextValues = {
    token: token,
    setToken: setToken,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
