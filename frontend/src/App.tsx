import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import BreadCrumbs from "./components/BreadCrumbs/BreadCrumbs";

function App() {
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>
        <BreadCrumbs />
      </footer>
    </>
  );
}

export default App;
