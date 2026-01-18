import "./DataButton.css";
import type { geoTopicBranch } from "./../../types/dataTypes";
import { useEffect, useState } from "react";
import { GetTopic } from "../../functions/GetTopic";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { Button } from "@mui/material";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import { GetGeolocByGeoByTopic } from "../../functions/GetGeo";

interface DataButtonProps {
  currentBranch: geoTopicBranch;
  chosenPath: geoTopicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<geoTopicBranch[]>>;
  setCurrentBranch: React.Dispatch<React.SetStateAction<geoTopicBranch>>;
  childValueTotalWithYear: number;
  isYear: number;
  setIsYear: React.Dispatch<React.SetStateAction<number>>;
  previousBranchName: string;
  setShowLineChart: React.Dispatch<React.SetStateAction<boolean>>;
  setLineChartToShow: React.Dispatch<
    React.SetStateAction<geoTopicBranch | undefined>
  >;
  topicOrLocation: boolean;
}

export default function DataButton({
  currentBranch,
  chosenPath,
  setChosenPath,
  setCurrentBranch,
  childValueTotalWithYear,
  isYear,
  setIsYear,
  previousBranchName,
  setShowLineChart,
  setLineChartToShow,
  topicOrLocation,
}: DataButtonProps) {
  const [nextBranch, setNextBranch] = useState<geoTopicBranch>(currentBranch);

  useEffect(() => {
    if (topicOrLocation && currentBranch.id.length > 35) {
      GetTopic(currentBranch.id).then((data) => setNextBranch(data));
    }
    if (
      !topicOrLocation &&
      currentBranch.id.toString().length < 6 &&
      currentBranch.topicId
    ) {
      GetGeolocByGeoByTopic(currentBranch.topicId, currentBranch.id).then(
        (data) => {
          const localization = {
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
          setNextBranch(localization);
        }
      );
    }
    if (currentBranch.id.length < 35 && currentBranch.id.length > 6) {
      setNextBranch(currentBranch);
    }
  }, [topicOrLocation, currentBranch]);

  const nextBranchValue = nextBranch.values.find((info) => info[0] === isYear);

  const handleChangingBranch = () => {
    setChosenPath(chosenPath);
    chosenPath.push(nextBranch);
    setCurrentBranch(nextBranch);
    // prend en compte les années possible sur le topic en question
    if (currentBranch.values.length > 0) {
      const isYearSelected = currentBranch.values.filter(
        (info) => info[0] === isYear
      );
      if (isYearSelected.length === 0) {
        setIsYear(currentBranch.values[0][0]);
      }
    } else {
      if (nextBranch.values.length > 0) {
        if (!nextBranchValue) {
          setIsYear(nextBranch.values[0][0]);
        }
      } else {
        if (nextBranch.children && nextBranch.children[0].values.length > 0) {
          const grandChildValue = nextBranch.children[0].values.find(
            (info) => info[0] === isYear
          );
          if (!grandChildValue) {
            const sortedValues = nextBranch.children[0].values.sort(
              (a, b) => b[0] - a[0]
            );
            setIsYear(sortedValues[0][0]);
          }
        }
      }
    }
  };

  let percentage = "0";

  if (nextBranchValue && childValueTotalWithYear !== 0) {
    if (childValueTotalWithYear > 0) {
      percentage = (
        (nextBranchValue[1] / childValueTotalWithYear) *
        100
      ).toFixed(1);
    } else {
      percentage = (
        (nextBranchValue[1] / Math.abs(childValueTotalWithYear)) *
        100
      ).toFixed(1);
    }
  }

  const [unitIsRatio, setUnitIsRatio] = useState(false);

  useEffect(() => {
    if (nextBranch.unit.includes("/") || nextBranch.unit.includes("%")) {
      setUnitIsRatio(true);
    }
  }, []);

  return (
    <>
      {nextBranch && nextBranch.children && nextBranch.children.length > 0 ? (
        <button
          type="button"
          className={
            nextBranch.name === previousBranchName
              ? "last_chosen_tree_node"
              : "tree_node"
          }
          key={nextBranch.id}
          onClick={handleChangingBranch}
          disabled={isYear === 10 && !nextBranch.id.includes("1_")}
        >
          <p>{nextBranch.name[0].toUpperCase() + nextBranch.name.slice(1)}</p>
          <p>
            {nextBranch.parentId &&
              (nextBranch.parentId.length > 15 ||
                nextBranch.parentId.length < 6) &&
              percentage !== "0" &&
              !unitIsRatio &&
              percentage + " %"}
            <ChevronRightOutlinedIcon />
          </p>
        </button>
      ) : nextBranchValue ? (
        <section className="last_topic_branch">
          <button
            type="button"
            className="tree_end"
            key={nextBranch.id}
            disabled
          >
            <p>{nextBranch.name}</p>
            <p>
              {!unitIsRatio
                ? percentage + " %"
                : nextBranchValue[1].toFixed(1) + nextBranch.unit}
            </p>
          </button>
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
              setLineChartToShow(nextBranch);
            }}
          >
            <ShowChartOutlinedIcon />
          </Button>
        </section>
      ) : (
        <button
          type="button"
          className="tree_unknown"
          key={nextBranch.id}
          disabled
        >
          <p>{nextBranch.name}</p>
          <p>en construction</p>
        </button>
      )}
    </>
  );
}
