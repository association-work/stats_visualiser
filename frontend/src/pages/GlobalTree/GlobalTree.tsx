import "./GlobalTree.css";
import { useContext } from "react";
import DataButton from "../../components/DataButton/DataButton";
import GlobalContext from "../../contexts/GlobalContext";
import DetailsButton from "../../components/DetailsButton/DetailsButton";

export default function GlobalTree() {
  const { currentBranch } = useContext(GlobalContext);

  return (
    <section className="global_tree">
      <section className="current_branch">
        <button type="button" className="branch_title">
          {currentBranch.name}
        </button>
        {currentBranch.values.length !== 0 && (
          <DetailsButton details={currentBranch} />
        )}
      </section>
      {currentBranch.children && (
        <article className="linked_children">
          {currentBranch.children.map((kid) => (
            <DataButton information={kid} key={kid.id} />
          ))}
        </article>
      )}
    </section>
  );
}
