import "./GlobalTree.css";
import BigData from "../../data.json";
import { useState } from "react";
import type { branch } from "../../types/dataTypes";
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import DataButton from "../../components/DataButton/DataButton";
import PieChart from "../../components/PieChart/PieChart";

export default function GlobalTree() {
  const entireTree = BigData.themes[0];

  const [chosenPath, setChosenPath] = useState<branch[]>([entireTree]);

  const [currentBranch, setCurrentBranch] = useState<branch>(entireTree);

  const handleChangedBranch = (index: number) => {
    currentBranch.children.forEach((kid, id) => {
      if (id === index) {
        chosenPath.push(kid);
        setChosenPath(chosenPath);
        setCurrentBranch(currentBranch.children[id]);
      }
    });
  };

  return (
    <section className="global_tree">
      <article className="data_tree">
        <button type="button" className="branch_title">
          {currentBranch.name}
        </button>
        {/* <p className="branch_title">
          {currentBranch.values} >> il manque le contexte pour le choix des dates.
        </p> */}
        {currentBranch.children && (
          <article className="linked_children">
            {currentBranch.children.map((kid, index) => (
              <DataButton
                information={kid}
                key={index}
                index={index}
                handleChangedBranch={handleChangedBranch}
              />
            ))}
          </article>
        )}
        <PieChart />
      </article>
      <BreadCrumbs
        chosenPath={chosenPath}
        setChosenPath={setChosenPath}
        setCurrentBranch={setCurrentBranch}
      />
    </section>
  );
}
