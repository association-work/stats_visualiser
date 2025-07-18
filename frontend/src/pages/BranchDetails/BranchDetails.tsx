import "./BranchDetails.css";
import { Link, useParams } from "react-router-dom";
import type { topicBranch } from "../../types/dataTypes";
import PieCharts from "../../components/PieChart/PieChart";
import LineChart from "../../components/LineChart/LineChart";
import { useEffect, useState } from "react";
import { GetTopic } from "../../functions/GetTopic";

export default function BranchDetails() {
  const { id } = useParams();

  const [branchDetailsData, setBranchDetailsData] = useState<topicBranch>({
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
  });

  useEffect(() => {
    id &&
      GetTopic(id).then((data) => {
        setBranchDetailsData(data);
      });
  }, []);

  // if (id === "1") {
  //   isBranch = entireTree;
  // } else {
  //   const isId = Number(id);
  //   isBranch = entireTree.children.filter((kid) => kid.id === isId)[0];
  // }

  return (
    <>
      {branchDetailsData.id !== "" ? (
        <article className="details">
          <h1>{branchDetailsData.name}</h1>
          <section className="data_branch">
            <article className="branch_parts">
              <h2>Répartition : </h2>
              <PieCharts currentBranch={branchDetailsData} />
              <article className="more_branch">
                <hr />
                {branchDetailsData.children &&
                  branchDetailsData.children.map((kid, index) => (
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
              <LineChart currentBranch={branchDetailsData} />
            </article>
          </section>
          <p>Source : à fournir</p>
        </article>
      ) : (
        <p>loading ...</p>
      )}
    </>
  );
}
