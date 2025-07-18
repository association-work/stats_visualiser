import { createContext, useState } from "react";
import type { topicBranch } from "../types/dataTypes";

const GlobalContext = createContext<GlobalProps>({
  isYear: 2023,
  setIsYear: () => {},
  chosenPath: [],
  setChosenPath: () => {},
  currentBranch: {
    id: "",
    name: "",
    source: {
      name: "CITEPA",
      url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
    },
    unit: "Mt CO2e",
    values: [],
    hasChildren: true,
    parentId: "",
  },
  setCurrentBranch: () => {},
  topicOrigin: {
    id: "",
    name: "",
    source: {
      name: "CITEPA",
      url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
    },
    unit: "",
    values: [],
    hasChildren: true,
    parentId: "",
  },
  setTopicOrigin: () => {},
});

interface GlobalProps {
  isYear: number;
  setIsYear: React.Dispatch<React.SetStateAction<number>>;
  chosenPath: topicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<topicBranch[]>>;
  currentBranch: topicBranch;
  setCurrentBranch: React.Dispatch<React.SetStateAction<topicBranch>>;
  topicOrigin: topicBranch;
  setTopicOrigin: React.Dispatch<React.SetStateAction<topicBranch>>;
}

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isYear, setIsYear] = useState<number>(2023);

  const [topicOrigin, setTopicOrigin] = useState<topicBranch>({
    id: "",
    name: "",
    source: {
      name: "CITEPA",
      url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
    },
    unit: "",
    values: [],
    hasChildren: false,
    parentId: "",
  });

  const [currentBranch, setCurrentBranch] = useState<topicBranch>({
    id: "0_environnement",
    name: "Environnement",
    source: {
      name: "CITEPA",
      url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
    },
    unit: "",
    values: [],
    hasChildren: false,
    parentId: "",
  });

  const [chosenPath, setChosenPath] = useState<topicBranch[]>([currentBranch]);

  return (
    <GlobalContext.Provider
      value={{
        isYear,
        setIsYear,
        chosenPath,
        setChosenPath,
        currentBranch,
        setCurrentBranch,
        topicOrigin,
        setTopicOrigin,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
