// import { Outlet } from "react-router-dom"; // To unlock if other pages are needed
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import BreadCrumbs from "./components/BreadCrumbs/BreadCrumbs";
import type { topicBranch } from "./types/dataTypes";
import { useEffect, useState } from "react";
import { GetTopics } from "./functions/GetTopic";
import GlobalTree from "./pages/GlobalTree/GlobalTree";
import Loader from "./pages/Loader/Loader";

function App() {
  const [isYear, setIsYear] = useState<number>(2023);

  const [topicOriginEnvironment, setTopicOriginEnvironment] =
    useState<topicBranch>({
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

  const [topicOriginHuman, setTopicOriginHuman] = useState<topicBranch>({
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
    id: "00_welcome",
    name: "Welcome",
    source: {
      name: "CITEPA",
      url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
    },
    unit: "",
    values: [],
    children: [
      {
        id: "0_être_humain",
        name: "Être humain",
        source: {
          name: "Banque Mondiale",
          url: "https://databank.worldbank.org/source/population-estimates-and-projections#",
        },
        unit: "",
        values: [],
        children: [topicOriginHuman],
        hasChildren: true,
        parentId: "00_welcome",
      },
      {
        id: "0_environnement",
        name: "Environnement",
        source: {
          name: "CITEPA",
          url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
        },
        unit: "",
        values: [],
        children: [
          topicOriginEnvironment,
          {
            id: "1_matières premières",
            name: "Matières premières",
            source: {
              name: "CITEPA",
              url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
            },
            unit: "",
            values: [],
            hasChildren: false,
            parentId: "0_environnement",
          },
          {
            id: "1_surfaces_disponibles",
            name: "Surfaces disponibles",
            source: {
              name: "CITEPA",
              url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
            },
            unit: "",
            values: [],
            hasChildren: false,
            parentId: "0_environnement",
          },
          {
            id: "1_énergie",
            name: "Énergie",
            source: {
              name: "CITEPA",
              url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
            },
            unit: "",
            values: [],
            hasChildren: false,
            parentId: "0_environnement",
          },
          {
            id: "1_climat",
            name: "Climat",
            source: {
              name: "CITEPA",
              url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
            },
            unit: "",
            values: [],
            hasChildren: false,
            parentId: "0_environnement",
          },
        ],
        hasChildren: true,
        parentId: "00_welcome",
      },
      {
        id: "0_économie",
        name: "Économie",
        source: {
          name: "CITEPA",
          url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
        },
        unit: "",
        values: [],
        hasChildren: false,
        parentId: "00_welcome",
      },
    ],
    hasChildren: true,
    parentId: "",
  });

  const [chosenPath, setChosenPath] = useState<topicBranch[]>([]);

  useEffect(() => {
    GetTopics().then((data) => {
      // setCurrentBranch(data[0]); A remettre en place une fois la BDD mise à jour avec les nouvelles informations
      setTopicOriginEnvironment(data[0]);
      setTopicOriginHuman(data[1]);
      if (
        currentBranch.children &&
        currentBranch.children[1].children &&
        currentBranch.children[0].children
      ) {
        currentBranch.children[1].children[0] = data[0];
        currentBranch.children[0].children[0] = data[1];
        setCurrentBranch(currentBranch);
        setChosenPath([currentBranch]);
      }
      setTopicIsReady(true);
    });
  }, []);

  const [previousBranchName, setPreviousBranchName] = useState<string>("");

  const [topicIsReady, setTopicIsReady] = useState(false);

  return (
    <>
      <Navbar
        setIsYear={setIsYear}
        topicOrigin={topicOriginEnvironment}
        currentBranch={currentBranch}
      />
      <main>
        {!topicIsReady ? (
          <Loader />
        ) : (
          <GlobalTree
            isYear={isYear}
            chosenPath={chosenPath}
            setChosenPath={setChosenPath}
            currentBranch={currentBranch}
            setCurrentBranch={setCurrentBranch}
            previousBranchName={previousBranchName}
            setPreviousBranchName={setPreviousBranchName}
          />
        )}
      </main>
      <BreadCrumbs
        chosenPath={chosenPath}
        setChosenPath={setChosenPath}
        setCurrentBranch={setCurrentBranch}
        setPreviousBranchName={setPreviousBranchName}
      />
    </>
  );
}

export default App;
