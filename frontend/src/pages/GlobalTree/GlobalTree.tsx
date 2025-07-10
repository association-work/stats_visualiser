import "./GlobalTree.css";
import { useContext } from "react";
import DataButton from "../../components/DataButton/DataButton";
import { Link } from "react-router-dom";
import GlobalContext from "../../contexts/GlobalContext";

export default function GlobalTree() {
  const { chosenPath, setChosenPath, setCurrentBranch, currentBranch, isYear } =
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

  const isvalue = currentBranch.values.filter(
    (info) => info.year === isYear
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
            <p>{isvalue.value + " Mt CO2e"}</p>
            <p>{"+"}</p>
          </Link>
        </section>
        {/* mettre une condition de clickabilité si il y a des petits enfants ou si il n'y en a pas */}
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
