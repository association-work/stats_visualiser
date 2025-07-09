import { createContext, useState } from "react";
import type { branch } from "../types/dataTypes";
import BigData from "../data.json";

const entireTree = BigData.themes[0];

const GlobalContext = createContext<GlobalProps>({
  isYear: 2000,
  setIsYear: () => {},
  chosenPath: [],
  setChosenPath: () => {},
  currentBranch: entireTree,
  setCurrentBranch: () => {},
});

interface GlobalProps {
  isYear: number;
  setIsYear: React.Dispatch<React.SetStateAction<number>>;
  chosenPath: branch[];
  setChosenPath: React.Dispatch<React.SetStateAction<branch[]>>;
  currentBranch: branch;
  setCurrentBranch: React.Dispatch<React.SetStateAction<branch>>;
}

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isYear, setIsYear] = useState<number>(2000);

  const [chosenPath, setChosenPath] = useState<branch[]>([entireTree]);
  const [currentBranch, setCurrentBranch] = useState<branch>(entireTree);
  return (
    <GlobalContext.Provider
      value={{
        isYear,
        setIsYear,
        chosenPath,
        setChosenPath,
        currentBranch,
        setCurrentBranch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
