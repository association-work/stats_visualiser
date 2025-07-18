import "./BranchDetails.css";
import { Link, useParams } from "react-router-dom";
import type { topicBranch } from "../../types/dataTypes";
import PieCharts from "../../components/PieChart/PieChart";
import LineChart from "../../components/LineChart/LineChart";
import { useEffect } from "react";

export default function BranchDetails() {
  const { id } = useParams();

  let isBranch: topicBranch = {
    id: "",
    name: "",
    source: {
      name: "",
      url: "",
    },
    unit: "",
    values: [],
    hasChildren: true,
    parentId: "",
  };

  useEffect(() => {
    fetch(`https://stats-visualiser.onrender.com/topic/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data[0]);
        isBranch = data[0];
      });
  }, []);

  // if (id === "1") {
  //   isBranch = entireTree;
  // } else {
  //   const isId = Number(id);
  //   isBranch = entireTree.children.filter((kid) => kid.id === isId)[0];
  // }

  return (
    <article className="details">
      <h1>{isBranch.name}</h1>
      <section className="data_branch">
        <article className="branch_parts">
          <h2>Répartition : </h2>
          <PieCharts currentBranch={isBranch} />
          <article className="more_branch">
            <hr />
            {isBranch.children &&
              isBranch.children.map((kid, index) => (
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
