import "./GlobalTree.css";
import DataButton from "../../components/DataButton/DataButton";
import PieCharts from "../../components/PieChart/PieChart";
import type { topicBranch } from "../../types/dataTypes";
import { useEffect, useState } from "react";
import line_chart from "../../../src/assets/line_chart.png";
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
    GetTopic(id).then((data: topicBranch) => setCurrentBranch(data));
    setPreviousBranchName(chosenPath[chosenPath.length - 1].name);
    chosenPath.pop();
    setChosenPath(chosenPath);
  };

  const [childValueTotalWithYear, setChildValueTotalWithYear] = useState(0);

  const [chartedLineDataTree, setChartedLineDataTree] = useState<
    { name: string; value: number }[]
  >([]);

  return (
    isYear !== 0 &&
    isvalue && (
      <section className={hasValue > 0 ? "global_tree" : "no_pie"}>
        <section className="branch_evolution">
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
          <article className="current_branch">
            <button
              type="button"
              className="branch_title"
              onClick={() => handleGoingBackOnce(currentBranch.parentId)}
            >
              {currentBranch.name !== "Emissions GES" ? (
                <p>
                  <img src={go_back} alt="navigation back" />{" "}
                  {currentBranch.name}
                </p>
              ) : (
                currentBranch.name
              )}
            </button>
            {currentBranch.values.length !== 0 && (
              <button type="button" className="branch_value">
                <p>{isvalue[0][1].toFixed(2) + " Mt CO2e"}</p>
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
              <LineChart
                currentBranch={currentBranch}
                chartedLineDataTree={chartedLineDataTree}
                setChartedLineDataTree={setChartedLineDataTree}
              />
              <div className="references">
                <p>Source : </p>
                <a href={currentBranch.source.url} target="_blank">
                  {currentBranch.source.name}
                </a>
              </div>
            </article>
          )}
        </section>
        {currentBranch.children && (
          <section
            className={hasValue > 0 ? "linked_charted" : "linked_children"}
          >
            {hasValue > 0 ? (
              <article className="camembert_chart">
                {childValueTotalWithYear !== 0 &&
                  currentBranch.values.length === 0 && (
                    <p>
                      Total des émissions : {childValueTotalWithYear} Mt CO2e
                    </p>
                  )}
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
