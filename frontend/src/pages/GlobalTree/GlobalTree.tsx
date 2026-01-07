import "./GlobalTree.css";
import DataButton from "../../components/DataButton/DataButton";
import PieCharts from "../../components/PieChart/PieChart";
import type { geoTopicBranch } from "../../types/dataTypes";
import { useEffect, useState } from "react";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import LineChart from "../../components/LineChart/LineChart";
import { GetTopic } from "../../functions/GetTopic";
import { Button } from "@mui/material";
import ValuePanel from "../../components/ValuePanel/ValuePanel";
import { GetGeolocByGeoByTopic } from "../../functions/GetGeo";

interface GlobalTreeProps {
  isYear: number;
  setIsYear: React.Dispatch<React.SetStateAction<number>>;
  chosenPathStats: geoTopicBranch[];
  setChosenPathStats: React.Dispatch<React.SetStateAction<geoTopicBranch[]>>;
  currentBranch: geoTopicBranch;
  setCurrentBranch: React.Dispatch<React.SetStateAction<geoTopicBranch>>;
  previousBranchName: string;
  setPreviousBranchName: React.Dispatch<React.SetStateAction<string>>;
  showLineChart: boolean;
  setShowLineChart: React.Dispatch<React.SetStateAction<boolean>>;
  setTopicOrLocation: React.Dispatch<React.SetStateAction<boolean>>;
  topicOrLocation: boolean;
}

export default function GlobalTree({
  isYear,
  setIsYear,
  chosenPathStats,
  setChosenPathStats,
  currentBranch,
  setCurrentBranch,
  previousBranchName,
  setPreviousBranchName,
  showLineChart,
  setShowLineChart,
  setTopicOrLocation,
  topicOrLocation,
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

  const [childrenTotalValues, setChildrenTotalValues] = useState<
    [number, number][]
  >([]);
  const [childValueTotalWithYear, setChildValueTotalWithYear] = useState(0);

  useEffect(() => {
    setChildValueTotalWithYear(0);
    setChildrenTotalValues([]);
    if (currentBranch.children) {
      let totalValue = 0;
      let newChildrenTotalValues: [number, number][] = [];
      for (let i = 0; i < currentBranch.children[0].values.length; i++) {
        totalValue = 0;
        const thatYear = currentBranch.children[0].values[i][0];
        currentBranch.children.forEach((element) => {
          const childValue = element.values.find(
            (info) => info[0] === thatYear
          );
          if (childValue) {
            totalValue = totalValue + childValue[1];
          }
        });
        totalValue = Number(totalValue.toFixed(2));
        newChildrenTotalValues.push([thatYear, totalValue]);
      }
      setChildrenTotalValues(newChildrenTotalValues);
      //récupération d'une seule valeur pour l'année demandée
      const newChildValue = newChildrenTotalValues.find(
        (info) => info[0] === isYear
      );
      if (newChildValue) {
        totalValue = 0;
        totalValue = Number(newChildValue[1].toFixed(2));
        setChildValueTotalWithYear(totalValue);
      }
    }
  }, [currentBranch, isYear]);
  // changement de branche après l'appuie sur le boutton parent

  const handleGoingBackOnce = (currentBranch: geoTopicBranch) => {
    if (!currentBranch.parentId) {
      setCurrentBranch(chosenPathStats[0]);
      setTopicOrLocation(true);
    }
    if (currentBranch.parentId.length > 35) {
      GetTopic(currentBranch.parentId).then((data: geoTopicBranch) =>
        setCurrentBranch(data)
      );
    }
    if (!topicOrLocation && currentBranch.topicId) {
      GetGeolocByGeoByTopic(currentBranch.topicId, currentBranch.parentId).then(
        (data: geoTopicBranch) => {
          console.log(data);
          let localization;
          if (data.parentId) {
            localization = {
              id: data.id.toString(),
              name: data.name,
              source: data.source,
              unit: data.unit,
              children: data.children,
              values: data.values.sort((a, b) => b[0] - a[0]),
              hasChildren: data.hasChildren,
              parentId: data.parentId.toString(),
              externalId: data.externalId,
              topicId: data.topicId,
            };
          } else {
            localization = {
              id: data.id.toString(),
              name: data.name,
              source: data.source,
              unit: data.unit,
              children: data.children,
              values: data.values.sort((a, b) => b[0] - a[0]),
              hasChildren: data.hasChildren,
              parentId: data.parentId,
              externalId: data.externalId,
              topicId: data.topicId,
            };
          }

          if (localization) {
            setCurrentBranch(localization);
          }
        }
      );
    }
    if (
      currentBranch.parentId.length < 35 &&
      currentBranch.parentId.length > 6
    ) {
      setCurrentBranch(chosenPathStats[chosenPathStats.length - 2]);
    }
    setPreviousBranchName(chosenPathStats[chosenPathStats.length - 1].name);
    chosenPathStats.pop();
    setChosenPathStats(chosenPathStats);
    // prend en compte les années possible sur le topic en question
    const lastElementOfPath = chosenPathStats[chosenPathStats.length - 1];
    if (lastElementOfPath.values.length > 0) {
      const isYearSelected = lastElementOfPath.values.filter(
        (info) => info[0] === isYear
      );
      if (isYearSelected.length === 0) {
        setIsYear(lastElementOfPath.values[0][0]);
      }
    } else {
      if (
        lastElementOfPath.children &&
        lastElementOfPath.children[0].values.length > 0
      ) {
        const childValue = lastElementOfPath.children[0].values.find(
          (info) => info[0] === isYear
        );
        if (!childValue) {
          const sortedValues = lastElementOfPath.children[0].values.sort(
            (a, b) => b[0] - a[0]
          );
          setIsYear(sortedValues[0][0]);
        }
      }
    }
  };

  const [lineChartToShow, setLineChartToShow] = useState<geoTopicBranch>();

  console.log(currentBranch);

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
        <LineChart
          currentBranch={lineChartToShow}
          childrenTotalValues={childrenTotalValues}
        />
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
            <Button
              variant="contained"
              className="branch_title"
              sx={{
                borderRadius: "8px",
                backgroundColor: "var(--highligth-color)",
                color: "var(--bg-color-ligth)",
                padding: ".8em",
                minWidth: "50%",
                textTransform: "capitalize",
                fontFamily: "var(--main-font)",
                fontSize: "16px",
              }}
              onClick={() => handleGoingBackOnce(currentBranch)}
            >
              <p>
                <ChevronLeftOutlinedIcon />
                {currentBranch.name[0].toUpperCase() +
                  currentBranch.name.slice(1)}
              </p>
            </Button>
            <article className="value_chart">
              {!currentBranch.id.includes("0_") &&
                !currentBranch.id.includes("1_") &&
                currentBranch.children &&
                !currentBranch.children[0].unit.includes("%") &&
                !currentBranch.children[0].unit.includes("/") && (
                  <ValuePanel
                    isYear={isYear}
                    currentBranch={currentBranch}
                    currentValue={currentValue}
                    childValueTotalWithYear={childValueTotalWithYear}
                    childrenTotalValues={childrenTotalValues}
                  />
                )}
              {!currentBranch.id.includes("0_") &&
                !currentBranch.id.includes("1_") &&
                currentBranch.children &&
                !currentBranch.children[0].unit.includes("%") &&
                !currentBranch.children[0].unit.includes("/") && (
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
            {currentBranch.id.length > 15 &&
            hasValue > 0 &&
            !currentBranch.children[0].unit.includes("/") ? (
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
                    currentBranch={kid}
                    key={kid.id}
                    chosenPathStats={chosenPathStats}
                    setChosenPathStats={setChosenPathStats}
                    setCurrentBranch={setCurrentBranch}
                    childValueTotalWithYear={childValueTotalWithYear}
                    isYear={isYear}
                    setIsYear={setIsYear}
                    previousBranchName={previousBranchName}
                    setShowLineChart={setShowLineChart}
                    setLineChartToShow={setLineChartToShow}
                    topicOrLocation={topicOrLocation}
                  />
                ))}
            </article>
          </section>
        )}
      </section>
    ))
  );
}
