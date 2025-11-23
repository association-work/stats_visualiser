import { useEffect, useState } from "react";
import type { geoTopicBranch } from "../../types/dataTypes";
import "./ValuePanel.css";

interface ValuePanelProps {
  isYear: number;
  currentBranch: geoTopicBranch;
  currentValue: [number, number][];
  childValueTotalWithYear: number;
  childrenTotalValues: [number, number][];
}

export default function ValuePanel({
  isYear,
  currentBranch,
  currentValue,
  childValueTotalWithYear,
  childrenTotalValues,
}: ValuePanelProps) {
  let minYearPossible = 0;
  if (currentBranch.values.length > 0) {
    minYearPossible = currentBranch.values[currentBranch.values.length - 1][0];
  }
  if (
    currentBranch.values.length === 0 &&
    currentBranch.children &&
    currentBranch.children[0].values.length > 0
  ) {
    minYearPossible =
      currentBranch.children[0].values[
        currentBranch.children[0].values.length - 1
      ][0];
  }

  console.log(minYearPossible);

  // taux d'évolution = (finale - initiale / initiale) * 100

  let minus1YearsPercentage = "";
  if (currentBranch.values.length > 0 && isYear - 1 >= minYearPossible) {
    const currentMinus1Value = currentBranch.values.filter(
      (info) => info[0] === isYear - 1
    )[0][1];

    const percentage = (
      ((currentValue[0][1] - currentMinus1Value) / currentMinus1Value) *
      100
    ).toFixed(1);
    if (Number(percentage) > 0) {
      minus1YearsPercentage = "+" + percentage + " %";
    } else {
      minus1YearsPercentage = percentage + " %";
    }
  }

  const [childValueTotalYearMinus1, setChildValueTotalYearMinus1] =
    useState("");

  useEffect(() => {
    if (currentBranch.values.length === 0 && isYear - 1 >= minYearPossible) {
      let totalValue = 0;

      const childValue = childrenTotalValues.find(
        (info) => info[0] === isYear - 1
      );
      if (childValue) {
        totalValue = childValue[1];
      }
      totalValue = Number(totalValue.toFixed(2));

      const percentage = (
        ((childValueTotalWithYear - totalValue) / totalValue) *
        100
      ).toFixed(1);
      if (Number(percentage) > 0) {
        setChildValueTotalYearMinus1("+" + percentage + " %");
      } else {
        setChildValueTotalYearMinus1(percentage + " %");
      }
    }
  }, [childrenTotalValues, isYear, childValueTotalWithYear]);

  let Minus5YearsPercentage = "";
  if (currentBranch.values.length > 0 && isYear - 5 >= minYearPossible) {
    const currentMinus5Value = currentBranch.values.filter(
      (info) => info[0] === isYear - 5
    )[0][1];

    const percentage = (
      ((currentValue[0][1] - currentMinus5Value) / currentMinus5Value) *
      100
    ).toFixed(1);
    if (Number(percentage) > 0) {
      Minus5YearsPercentage = "+" + percentage + " %";
    } else {
      Minus5YearsPercentage = percentage + " %";
    }
  }

  const [childValueTotalYearMinus5, setChildValueTotalYearMinus5] =
    useState("");

  useEffect(() => {
    if (currentBranch.values.length === 0 && isYear - 5 >= minYearPossible) {
      let totalValue = 0;

      const childValue = childrenTotalValues.find(
        (info) => info[0] === isYear - 5
      );
      if (childValue) {
        totalValue = childValue[1];
      }
      totalValue = Number(totalValue.toFixed(2));

      const percentage = (
        ((childValueTotalWithYear - totalValue) / totalValue) *
        100
      ).toFixed(1);
      if (Number(percentage) > 0) {
        setChildValueTotalYearMinus5("+" + percentage + " %");
      } else {
        setChildValueTotalYearMinus5(percentage + " %");
      }
    }
  }, [childrenTotalValues, isYear, childValueTotalWithYear]);

  function numberWithSpaces(x: number) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  }

  return (
    <>
      {currentBranch.id.length > 15 && (
        <div className="branch_value">
          {currentValue.length !== 0 ? (
            <p>
              {numberWithSpaces(parseFloat(currentValue[0][1].toFixed(2))) +
                " "}
              <span>{currentBranch.unit}</span>
            </p>
          ) : childValueTotalWithYear !== 0 && currentBranch.children ? (
            <p>
              {numberWithSpaces(
                parseFloat(childValueTotalWithYear.toFixed(2))
              ) + " "}
              <span>{currentBranch.children[0].unit}</span>
            </p>
          ) : (
            <></>
          )}
          <div className="value_evolution">
            {isYear - 1 >= minYearPossible && minus1YearsPercentage ? (
              <p>
                {minus1YearsPercentage}
                <span>vs {isYear - 1} </span>
              </p>
            ) : childValueTotalYearMinus1 ? (
              <p>
                {childValueTotalYearMinus1}
                <span>vs {isYear - 1} </span>
              </p>
            ) : (
              <></>
            )}
            {isYear - 5 >= minYearPossible && Minus5YearsPercentage ? (
              <p>
                {Minus5YearsPercentage}
                <span>vs {isYear - 5} </span>
              </p>
            ) : childValueTotalYearMinus5 ? (
              <p>
                {childValueTotalYearMinus5}
                <span>vs {isYear - 5} </span>
              </p>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
}
