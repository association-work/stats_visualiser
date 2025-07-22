import "./GlobalTree.css";
import DataButton from "../../components/DataButton/DataButton";
import PieCharts from "../../components/PieChart/PieChart";
import type { topicBranch } from "../../types/dataTypes";
import { useEffect, useState } from "react";
import line_chart from "../../../public/line_chart.png";
import LineChart from "../../components/LineChart/LineChart";

interface GlobalTreeProps {
  isYear: number;
  chosenPath: topicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<topicBranch[]>>;
  currentBranch: topicBranch;
  setCurrentBranch: React.Dispatch<React.SetStateAction<topicBranch>>;
  chartedDataTree: { name: string; value: number }[];
  setChartedDataTree: React.Dispatch<
    React.SetStateAction<{ name: string; value: number }[]>
  >;
  childValueTotalWithYear: number;
  setChildValueTotalWithYear: React.Dispatch<React.SetStateAction<number>>;
  chartedLineDataTree: { name: string; value: number }[];
  setChartedLineDataTree: React.Dispatch<
    React.SetStateAction<{ name: string; value: number }[]>
  >;
}

export default function GlobalTree({
  isYear,
  chosenPath,
  setChosenPath,
  currentBranch,
  setCurrentBranch,
  chartedDataTree,
  setChartedDataTree,
  chartedLineDataTree,
  setChartedLineDataTree,
  childValueTotalWithYear,
  setChildValueTotalWithYear,
}: GlobalTreeProps) {
  const isvalue = currentBranch.values.filter((info) => info[0] === isYear);

  const [hasValue, setHasValue] = useState(0);
  useEffect(() => {
    if (currentBranch && currentBranch.children) {
      setHasValue(currentBranch.children[1].values.length);
    }
  });

  const [showLineChart, setShowLineChart] = useState(false);

  return (
    <section className={hasValue > 0 ? "global_tree" : "no_pie"}>
      <section className="branch_evolution">
        {currentBranch.values.length !== 0 && (
          <button
            type="button"
            onClick={() => setShowLineChart(true)}
            className="icon_linechart"
          >
            <img src={line_chart} alt="afficher le graphique de l'évolution" />
          </button>
        )}
        <article className="current_branch">
          <button type="button" className="branch_title">
            {currentBranch.name}
          </button>
          {currentBranch.values.length !== 0 && (
            <button type="button" className="branch_value">
              <p>{isvalue[0][1].toFixed(2) + " Mt CO2e"}</p>
              <p>{"+"}</p>
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
              <a href={currentBranch.source.url}>{currentBranch.source.name}</a>
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
              <PieCharts
                isYear={isYear}
                currentBranch={currentBranch}
                chartedDataTree={chartedDataTree}
                setChartedDataTree={setChartedDataTree}
                setChildValueTotalWithYear={setChildValueTotalWithYear}
              />
              <div className="references">
                <p>Source : </p>
                <a href={currentBranch.source.url}>
                  {currentBranch.source.name}
                </a>
              </div>
            </article>
          ) : (
            <p></p>
          )}
          <article className="listed_children">
            {currentBranch.children.map((kid) => (
              <DataButton
                information={kid}
                key={kid.id}
                chosenPath={chosenPath}
                setChosenPath={setChosenPath}
                setCurrentBranch={setCurrentBranch}
                childValueTotalWithYear={childValueTotalWithYear}
                setChildValueTotalWithYear={setChildValueTotalWithYear}
                isYear={isYear}
              />
            ))}
          </article>
        </section>
      )}
    </section>
  );
}
