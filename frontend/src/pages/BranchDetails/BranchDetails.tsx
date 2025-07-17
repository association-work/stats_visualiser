import "./BranchDetails.css";
import { Link, useParams } from "react-router-dom";
import BigData from "../../data.json";
import type { branch } from "../../types/dataTypes";
// import LineChart from "../../components/LineChart/LineChart";
// import PieChart from "../../components/PieChart/PieChart";
import PieCharts from "../../components/PieChart/PieChart";
import LineChart from "../../components/LineChart/LineChart";

export default function BranchDetails() {
  const { id } = useParams();
  const entireTree = BigData.themes[0];

  let isBranch: branch = {
    id: 0,
    name: "",
    parentId: 0,
    externalId: "",
    isSection: false,
    source: "",
    link: "",
    geography: "",
    geographyId: "",
    unit: "",
    isSummable: false,
    values: [],
    children: [],
  };

  if (id === "1") {
    isBranch = entireTree;
  } else {
    const isId = Number(id);
    isBranch = entireTree.children.filter((kid) => kid.id === isId)[0];
  }

  return (
    <article className="details">
      <h1>{isBranch.name}</h1>
      <section className="data_branch">
        <article className="branch_parts">
          <h2>Répartition : </h2>
          <PieCharts currentBranch={isBranch} />
          <article className="more_branch">
            <hr />
            {isBranch.children.map((kid, index) => (
              <section key={index}>
                <Link to={`/Details/${kid.id}`}>
                  {kid.name} {">"}
                </Link>
                <hr />
              </section>
            ))}
          </article>
        </article>
        <article className="evolution">
          <h2>Evolution : </h2>
          <LineChart currentBranch={isBranch} />
        </article>
      </section>
      <p>Source : à fournir</p>
    </article>
  );
}
