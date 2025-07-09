import "./GlobalTree.css";
import BigData from "../../data.json";
import { useState } from "react";
import type { branch } from "../../types/dataTypes";
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import DataButton from "../../components/DataButton/DataButton";
import { Link } from "react-router-dom";

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

  const isyear = 2009; // a remplacer par un context de date
  const isvalue = currentBranch.values.filter(
    (info) => info.year === isyear
  )[0];

  return (
    <section className="global_tree">
      <article className="data_tree">
        <section className="current_branch">
          <button type="button" className="branch_title">
            {currentBranch.name}
          </button>
          <Link
            to={`/Details/${currentBranch.id}`}
            className="branch_title_value"
          >
            <p>{isvalue.value}</p>
            {/* il manque l'unité de valeur... */}
            <p>{"+"}</p>
            {/* il manque le contexte pour le choix des dates. */}
          </Link>
        </section>

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
        chosenPath={chosenPath}
        setChosenPath={setChosenPath}
        setCurrentBranch={setCurrentBranch}
      />
    </section>
  );
}
