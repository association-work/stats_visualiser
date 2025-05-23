import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import { SectionData } from "./shared/Section/SectionData";
import { SectionTitle } from "./shared/Section/SectionTitle";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <div className="flex flex-col gap-m">
          <SectionTitle
            onClick={() => setCount((count) => count + 1)}
            label="Increase count"
          />
          <SectionData label={`count is ${count}`} onClick={() => {}} />
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
