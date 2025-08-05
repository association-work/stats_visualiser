// import { Outlet } from "react-router-dom"; // To unlock if other pages are needed
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import BreadCrumbs from "./components/BreadCrumbs/BreadCrumbs";
import type { topicBranch } from "./types/dataTypes";
import { useEffect, useState } from "react";
import { GetTopics } from "./functions/GetTopic";
import GlobalTree from "./pages/GlobalTree/GlobalTree";

function App() {
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

  useEffect(() => {
    GetTopics().then((data) => {
      setChosenPath([currentBranch, data[0]]);
      setCurrentBranch(data[0]);
      setTopicOrigin(data[0]);
    });
  }, []);

  const [previousBranchName, setPreviousBranchName] = useState<string>("");

  return (
    <>
      <nav>
        <Navbar setIsYear={setIsYear} topicOrigin={topicOrigin} />
      </nav>
      <main>
        <h1>{topicOrigin.name}</h1>
        <GlobalTree
          isYear={isYear}
          chosenPath={chosenPath}
          setChosenPath={setChosenPath}
          currentBranch={currentBranch}
          setCurrentBranch={setCurrentBranch}
          previousBranchName={previousBranchName}
          setPreviousBranchName={setPreviousBranchName}
        />
        {/* <Outlet /> */}
      </main>
      <footer>
        <BreadCrumbs
          chosenPath={chosenPath}
          setChosenPath={setChosenPath}
          setCurrentBranch={setCurrentBranch}
          setPreviousBranchName={setPreviousBranchName}
        />
      </footer>
    </>
  );
}

export default App;
