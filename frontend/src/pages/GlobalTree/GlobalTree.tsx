import "./GlobalTree.css";
import { useContext } from "react";
import DataButton from "../../components/DataButton/DataButton";
import GlobalContext from "../../contexts/GlobalContext";

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
      </article>
    </section>
  );
}
