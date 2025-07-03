import { createContext, useState } from "react";

const GlobalContext = createContext<GlobalProps>();

interface GlobalProps {
  isYear: number;
  setIsYear: React.Dispatch<React.SetStateAction<number>>;
}

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isYear, setIsYear] = useState<number>(0);
  console.log(isYear);
  return (
    <GlobalContext.Provider value={{ isYear, setIsYear }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
