import "./GlobalTree.css";
import { useContext } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import DataButton from "../../components/DataButton/DataButton";
import PieCharts from "../../components/PieChart/PieChart";

export default function GlobalTree() {
  const { currentBranch, isYear } = useContext(GlobalContext);

  const isvalue = currentBranch.values.filter((info) => info[0] === isYear);

  return (
    <section className="global_tree">
      <section className="current_branch">
        <button type="button" className="branch_title">
          {currentBranch.name}
        </button>
        {/* ajouter une icône pour faire popup du lineGraf */}
        {currentBranch.values.length !== 0 && (
          <button type="button" className="branch_value">
            <p>{isvalue[0][1].toFixed(2) + " Mt CO2e"}</p>
            <p>{"+"}</p>
          </button>
        )}
      </section>
      {currentBranch.children && (
        <section className="linked_children">
          <article>
            <PieCharts />
          </article>
          <article className="listed_children">
            {currentBranch.children.map((kid) => (
              <DataButton information={kid} key={kid.id} />
            ))}
          </article>
        </section>
      )}
    </section>
  );
}
