import "./GlobalTree.css";
import BigData from "../../data.json";
import { useState } from "react";
import type { branch } from "../../types/dataTypes";
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import DataButton from "../../components/DataButton/DataButton";

export default function GlobalTree() {
  const entireTree = BigData.themes[0];

  const [chosenPath, setChosenPath] = useState<string[]>([
    `${entireTree.name}`,
  ]);
  const [path, setPath] = useState("");
  const [currentBranch, setCurrentBranch] = useState<branch>(entireTree);

  const handleChangedBranch = (index: number) => {
    setPath("");
    currentBranch.children.map((kid, id) => {
      if (id === index) {
        setPath(kid.name);
        setCurrentBranch(currentBranch.children[id]);
      }
    });
    if (path !== "") {
      chosenPath.push(path);
      setChosenPath(chosenPath);
    }
  };

  console.log(currentBranch);

  return (
    <section className="global_tree">
      <article className="data_tree">
        <button type="button" className="branch_title">
          {currentBranch.name}
        </button>
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
      </article>
      <BreadCrumbs
        entireTree={entireTree}
        chosenPath={chosenPath}
        setChosenPath={setChosenPath}
        setCurrentBranch={setCurrentBranch}
      />
    </section>
  );
}
