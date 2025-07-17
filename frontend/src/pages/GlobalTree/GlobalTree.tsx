import "./GlobalTree.css";
import { useContext } from "react";
import DataButton from "../../components/DataButton/DataButton";
import GlobalContext from "../../contexts/GlobalContext";
import DetailsButton from "../../components/DetailsButton/DetailsButton";

export default function GlobalTree() {
  const { chosenPath, setChosenPath, setCurrentBranch, currentBranch } =
    useContext(GlobalContext);

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
      <section className="current_branch">
        <button type="button" className="branch_title">
          {currentBranch.name}
        </button>
        <DetailsButton details={currentBranch} />
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
    </section>
  );
}
