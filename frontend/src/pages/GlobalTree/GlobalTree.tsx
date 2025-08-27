import "./GlobalTree.css";
import DataButton from "../../components/DataButton/DataButton";
import PieCharts from "../../components/PieChart/PieChart";
import type { topicBranch } from "../../types/dataTypes";
import { useEffect, useState } from "react";
import line_chart from "../../../src/assets/activity.svg";
import LineChart from "../../components/LineChart/LineChart";
import { GetTopic } from "../../functions/GetTopic";
import go_back from "../../assets/go-back.png";

interface GlobalTreeProps {
  isYear: number;
  chosenPath: topicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<topicBranch[]>>;
  currentBranch: topicBranch;
  setCurrentBranch: React.Dispatch<React.SetStateAction<topicBranch>>;
  previousBranchName: string;
  setPreviousBranchName: React.Dispatch<React.SetStateAction<string>>;
}

export default function GlobalTree({
  isYear,
  chosenPath,
  setChosenPath,
  currentBranch,
  setCurrentBranch,
  previousBranchName,
  setPreviousBranchName,
}: GlobalTreeProps) {
  // permet de récupérer la valeur de la branche actuelle
  const isvalue = currentBranch.values.filter((info) => info[0] === isYear);

  console.log(isvalue);

  useEffect(() => {
    if (currentBranch && currentBranch.children) {
      setHasValue(currentBranch.children[1].values.length);
    }
  }, [currentBranch]);

  //contrôle de l'affichage de certain éléments
  const [hasValue, setHasValue] = useState(0);

  const [showLineChart, setShowLineChart] = useState(false);

  // changement de branche après l'appuie sur le boutton parent

  const handleGoingBackOnce = (id: string) => {
    if (id && id.length > 35) {
      GetTopic(id).then((data: topicBranch) => setCurrentBranch(data));
    } else {
      setCurrentBranch(chosenPath[chosenPath.length - 2]);
    }
    setPreviousBranchName(chosenPath[chosenPath.length - 1].name);
    chosenPath.pop();
    setChosenPath(chosenPath);
  };

  const [childValueTotalWithYear, setChildValueTotalWithYear] = useState(0);

  return (
    isYear !== 0 &&
    isvalue && (
      <section className={hasValue > 0 ? "global_tree" : "no_pie"}>
        {currentBranch.name !== "Welcome" && (
          <section className="branch_evolution">
            {/* {currentBranch.name !== "Environnement" ? ( */}
            <button
              type="button"
              className="branch_title"
              onClick={() => handleGoingBackOnce(currentBranch.parentId)}
            >
              <p>
                <img src={go_back} alt="navigation back" />{" "}
                {currentBranch.name[0].toUpperCase() +
                  currentBranch.name.slice(1)}
              </p>
            </button>
            {/* ) : (
              <button type="button" className="branch_title">
                <p>
                  {currentBranch.name[0].toUpperCase() +
                    currentBranch.name.slice(1)}
                </p>
              </button>
            )} */}
            <article className="value_chart">
              {(currentBranch.values.length !== 0 ||
                childValueTotalWithYear !== 0) && (
                <button type="button" className="branch_value">
                  <p>
                    {childValueTotalWithYear !== 0
                      ? childValueTotalWithYear.toFixed(2) + " Mt CO2e"
                      : isvalue[0][1].toFixed(2) + " Mt CO2e"}
                  </p>
                </button>
              )}
              {currentBranch.values.length !== 0 && (
                <button
                  type="button"
                  onClick={() => setShowLineChart(true)}
                  className="icon_linechart"
                >
                  <img
                    src={line_chart}
                    alt="afficher le graphique de l'évolution"
                  />
                </button>
              )}
            </article>
            {showLineChart && (
              <article className="popup_linechart">
                <button
                  type="button"
                  onClick={() => setShowLineChart(false)}
                  className="closeButton"
                >
                  X
                </button>
                <LineChart currentBranch={currentBranch} />
                <div className="references">
                  <p>Source : </p>
                  <a href={currentBranch.source.url} target="_blank">
                    {currentBranch.source.name}
                  </a>
                </div>
              </article>
            )}
          </section>
        )}
        {currentBranch.children && (
          <section
            className={hasValue > 0 ? "linked_charted" : "linked_children"}
          >
            {hasValue > 0 ? (
              <article className="camembert_chart">
                <PieCharts
                  isYear={isYear}
                  currentBranch={currentBranch}
                  setChildValueTotalWithYear={setChildValueTotalWithYear}
                />
                <div className="references">
                  <p>Source : </p>
                  <a href={currentBranch.source.url} target="_blank">
                    {currentBranch.source.name}
                  </a>
                </div>
              </article>
            ) : (
              <p></p>
            )}
            <article className="listed_children">
              {currentBranch.children
                .map((child) => ({
                  ...child,
                  amount: child.values.find((info) => info[0] === isYear) ?? [
                    0, 0,
                  ],
                }))
                .sort((a, b) => b.amount[1] - a.amount[1])
                .map((kid) => (
                  <DataButton
                    information={kid}
                    key={kid.id}
                    chosenPath={chosenPath}
                    setChosenPath={setChosenPath}
                    setCurrentBranch={setCurrentBranch}
                    childValueTotalWithYear={childValueTotalWithYear}
                    setChildValueTotalWithYear={setChildValueTotalWithYear}
                    isYear={isYear}
                    previousBranchName={previousBranchName}
                    setPreviousBranchName={setPreviousBranchName}
                  />
                ))}
            </article>
          </section>
        )}
      </section>
    )
  );
}
