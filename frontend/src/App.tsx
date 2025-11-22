// import { Outlet } from "react-router-dom"; // To unlock if other pages are needed
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
// import BreadCrumbs from "./components/BreadCrumbs/BreadCrumbs";
import type { topicBranch } from "./types/dataTypes";
import { useEffect, useState } from "react";
import { GetTopics } from "./functions/GetTopic";
import GlobalTree from "./pages/GlobalTree/GlobalTree";
import Loader from "./pages/Loader/Loader";

function App() {
  const [isYear, setIsYear] = useState<number>(10);

  const [topicOriginEnvironment, setTopicOriginEnvironment] =
    useState<topicBranch>({
      id: "",
      name: "",
      source: {
        name: "CITEPA",
        url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
      },
      unit: "",
      values: [[2023, 0]],
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
    values: [[2020, 0]],
    hasChildren: false,
    parentId: "",
  });

  const [currentBranch, setCurrentBranch] = useState<topicBranch>({
    id: "0_welcome",
    name: "Welcome",
    source: {
      name: "CITEPA",
      url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
    },
    unit: "",
    values: [[2023, 0]],
    children: [
      {
        id: "1_être_humain",
        name: "Être humain",
        source: {
          name: "Banque Mondiale",
          url: "https://databank.worldbank.org/source/population-estimates-and-projections#",
        },
        unit: "",
        values: [],
        children: [topicOriginHuman],
        hasChildren: true,
        parentId: "0_welcome",
      },
      {
        id: "1_environnement",
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
            id: "2_matières premières",
            name: "Matières premières",
            source: {
              name: "CITEPA",
              url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
            },
            unit: "",
            values: [],
            hasChildren: false,
            parentId: "1_environnement",
          },
          {
            id: "2_surfaces_disponibles",
            name: "Surfaces disponibles",
            source: {
              name: "CITEPA",
              url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
            },
            unit: "",
            values: [],
            hasChildren: false,
            parentId: "1_environnement",
          },
          {
            id: "2_énergie",
            name: "Énergie",
            source: {
              name: "CITEPA",
              url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
            },
            unit: "",
            values: [],
            hasChildren: false,
            parentId: "1_environnement",
          },
          {
            id: "2_climat",
            name: "Climat",
            source: {
              name: "CITEPA",
              url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
            },
            unit: "",
            values: [],
            hasChildren: false,
            parentId: "1_environnement",
          },
        ],
        hasChildren: true,
        parentId: "0_welcome",
      },
      {
        id: "1_économie",
        name: "Économie",
        source: {
          name: "CITEPA",
          url: "https://www.citepa.org/donnees-air-climat/donnees-gaz-a-effet-de-serre/secten/",
        },
        unit: "",
        values: [],
        hasChildren: false,
        parentId: "0_welcome",
      },
    ],
    hasChildren: true,
    parentId: "",
  });

  const [chosenPath, setChosenPath] = useState<topicBranch[]>([currentBranch]);

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
    setIsYear(currentBranch.values[0][0]);
  }, []);

  const [previousBranchName, setPreviousBranchName] = useState<string>("");

  const [topicIsReady, setTopicIsReady] = useState(false);

  const [showLineChart, setShowLineChart] = useState(false);

  const [topicOrLocation, setTopicOrLocation] = useState(true);

  return (
    <>
      <nav>
        <Navbar
          setIsYear={setIsYear}
          currentBranch={currentBranch}
          isYear={isYear}
          topicOrLocation={topicOrLocation}
          setTopicOrLocation={setTopicOrLocation}
          chosenPath={chosenPath}
          setChosenPath={setChosenPath}
          setCurrentBranch={setCurrentBranch}
          setPreviousBranchName={setPreviousBranchName}
          setShowLineChart={setShowLineChart}
        />
      </nav>
      <main>
        {!topicIsReady ? (
          <Loader />
        ) : !topicOrLocation ? (
          <p>Les datas en fonction des pays sont en construction</p>
        ) : (
          <GlobalTree
            isYear={isYear}
            setIsYear={setIsYear}
            chosenPath={chosenPath}
            setChosenPath={setChosenPath}
            currentBranch={currentBranch}
            setCurrentBranch={setCurrentBranch}
            previousBranchName={previousBranchName}
            setPreviousBranchName={setPreviousBranchName}
            showLineChart={showLineChart}
            setShowLineChart={setShowLineChart}
          />
        )}
      </main>
    </>
  );
}

export default App;
