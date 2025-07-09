import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import BreadCrumbs from "./components/BreadCrumbs/BreadCrumbs";
import { useContext } from "react";
import GlobalContext from "./contexts/GlobalContext";

function App() {
  const { chosenPath, setChosenPath, setCurrentBranch } =
    useContext(GlobalContext);
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>
        <BreadCrumbs
          chosenPath={chosenPath}
          setChosenPath={setChosenPath}
          setCurrentBranch={setCurrentBranch}
        />
      </footer>
    </>
  );
}

export default App;
