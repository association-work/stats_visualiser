import "./GlobalTree.css";
import DataButton from "../../components/DataButton/DataButton";
import PieCharts from "../../components/PieChart/PieChart";
import type { topicBranch } from "../../types/dataTypes";
import { useEffect, useState } from "react";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import LineChart from "../../components/LineChart/LineChart";
import { GetTopic } from "../../functions/GetTopic";
import { Button } from "@mui/material";
import ValueButton from "../../components/ValueButton/ValueButton";

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
  const currentValue = currentBranch.values.filter(
    (info) => info[0] === isYear
  );

  //contrôle de l'affichage de certain éléments
  const [hasValue, setHasValue] = useState(0);

  useEffect(() => {
    if (currentBranch && currentBranch.children) {
      setHasValue(currentBranch.children[0].values.length);
    }
  }, [currentBranch]);

  const [showLineChart, setShowLineChart] = useState(false);

  const [childValueTotalWithYear, setChildValueTotalWithYear] = useState(0);

  useEffect(() => {
    if (currentBranch.children !== undefined) {
      let totalValue = 0;
      currentBranch.children.forEach((element) => {
        const childValue = element.values.find((info) => info[0] === isYear);
        if (childValue) {
          totalValue = totalValue + childValue[1];
        }
      });
      totalValue = Number(totalValue.toFixed(2));
      setChildValueTotalWithYear(totalValue);
    }
  }, [currentBranch, isYear]);

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

  const [lineChartToShow, setLineChartToShow] = useState<topicBranch>();

  console.log(isYear, currentBranch.id);

  return (
    isYear !== 0 &&
    currentValue &&
    (showLineChart && lineChartToShow ? (
      <article className="popup_linechart">
        <button
          type="button"
          onClick={() => setShowLineChart(false)}
          className="closeButton"
        >
          X
        </button>
        <LineChart currentBranch={lineChartToShow} />
        <div className="references">
          <p>Source : </p>
          <a href={currentBranch.source.url} target="_blank">
            {currentBranch.source.name}
          </a>
        </div>
      </article>
    ) : (
      <section className={hasValue > 0 ? "global_tree" : "no_pie"}>
        {currentBranch.name !== "Welcome" && (
          <section className="branch_evolution">
            <button
              type="button"
              className="branch_title"
              onClick={() => handleGoingBackOnce(currentBranch.parentId)}
            >
              <p>
                <ChevronLeftOutlinedIcon />
                {currentBranch.name[0].toUpperCase() +
                  currentBranch.name.slice(1)}
              </p>
            </button>
            <article className="value_chart">
              {isYear !== 10 && (
                <ValueButton
                  isYear={isYear}
                  currentBranch={currentBranch}
                  currentValue={currentValue}
                  childValueTotalWithYear={childValueTotalWithYear}
                />
              )}
              {currentBranch.values.length !== 0 && (
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "var(--highligth-color)",
                    padding: "6px",
                    minWidth: "3em",
                  }}
                  onClick={() => {
                    setShowLineChart(true);
                    setLineChartToShow(currentBranch);
                  }}
                >
                  <ShowChartOutlinedIcon />
                </Button>
              )}
            </article>
          </section>
        )}
        {currentBranch.children && (
          <section
            className={hasValue > 0 ? "linked_charted" : "linked_children"}
          >
            {hasValue > 0 && childValueTotalWithYear > 0 ? (
              <article className="camembert_chart">
                <PieCharts isYear={isYear} currentBranch={currentBranch} />
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
              {isYear === 10 && !currentBranch.id.includes("0_") && (
                <p>Merci de choisir une année</p>
              )}
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
                    isYear={isYear}
                    previousBranchName={previousBranchName}
                    setPreviousBranchName={setPreviousBranchName}
                    setShowLineChart={setShowLineChart}
                    setLineChartToShow={setLineChartToShow}
                  />
                ))}
            </article>
          </section>
        )}
      </section>
    ))
  );
}
