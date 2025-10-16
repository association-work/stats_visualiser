import { useEffect, useState } from "react";
import type { topicBranch } from "../../types/dataTypes";
import "./ValuePanel.css";

interface ValuePanelProps {
  isYear: number;
  currentBranch: topicBranch;
  currentValue: [number, number][];
  childValueTotalWithYear: number;
}

export default function ValuePanel({
  isYear,
  currentBranch,
  currentValue,
  childValueTotalWithYear,
}: ValuePanelProps) {
  let maxYearPossible = 0;
  if (currentBranch.values.length > 0) {
    maxYearPossible = currentBranch.values[0][0];
  }
  if (currentBranch.children && currentBranch.children[0].values.length > 0) {
    maxYearPossible = currentBranch.children[0].values[0][0];
  }

  let minYearPossible = 0;
  if (currentBranch.values.length > 0) {
    minYearPossible = currentBranch.values[currentBranch.values.length - 1][0];
  }
  if (currentBranch.children && currentBranch.children[0].values.length > 0) {
    minYearPossible =
      currentBranch.children[0].values[
        currentBranch.children[0].values.length - 1
      ][0];
  }

  // taux d'évolution = (finale - initiale / initiale) * 100

  let Plus2YearsPercentage = "";
  if (currentBranch.values.length > 0 && isYear <= maxYearPossible - 2) {
    const currentPlus2Value = currentBranch.values.filter(
      (info) => info[0] === isYear + 2
    )[0][1];

    const percentage = (
      ((currentPlus2Value - currentValue[0][1]) / currentValue[0][1]) *
      100
    ).toFixed(1);
    if (Number(percentage) > 0) {
      Plus2YearsPercentage = "+" + percentage + " %";
    } else {
      Plus2YearsPercentage = percentage + " %";
    }
  }

  const [childValueTotalYearPlus2, setChildValueTotalYearPlus2] = useState("");

  useEffect(() => {
    if (currentBranch.children && isYear <= maxYearPossible - 2) {
      let totalValue = 0;
      currentBranch.children.forEach((element) => {
        const childValue = element.values.find(
          (info) => info[0] === isYear + 2
        );
        if (childValue) {
          totalValue = totalValue + childValue[1];
        }
      });
      totalValue = Number(totalValue.toFixed(2));

      const percentage = (
        ((totalValue - childValueTotalWithYear) / childValueTotalWithYear) *
        100
      ).toFixed(1);
      if (Number(percentage) > 0) {
        setChildValueTotalYearPlus2("+" + percentage + " %");
      } else {
        setChildValueTotalYearPlus2(percentage + " %");
      }
    }
  }, [currentBranch, isYear, childValueTotalWithYear]);

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
    if (currentBranch.children && isYear - 1 >= minYearPossible) {
      let totalValue = 0;
      currentBranch.children.forEach((element) => {
        const childValue = element.values.find(
          (info) => info[0] === isYear - 1
        );
        if (childValue) {
          totalValue = totalValue + childValue[1];
        }
      });
      totalValue = Number(totalValue.toFixed(2));

      const percentage = (
        ((totalValue - childValueTotalWithYear) / childValueTotalWithYear) *
        100
      ).toFixed(1);
      if (Number(percentage) > 0) {
        setChildValueTotalYearMinus1("+" + percentage + " %");
      } else {
        setChildValueTotalYearMinus1(percentage + " %");
      }
    }
  }, [currentBranch, isYear, childValueTotalWithYear]);

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
    if (currentBranch.children && isYear - 5 >= minYearPossible) {
      let totalValue = 0;
      currentBranch.children.forEach((element) => {
        const childValue = element.values.find(
          (info) => info[0] === isYear - 5
        );
        if (childValue) {
          totalValue = totalValue + childValue[1];
        }
      });
      totalValue = Number(totalValue.toFixed(2));

      const percentage = (
        ((totalValue - childValueTotalWithYear) / childValueTotalWithYear) *
        100
      ).toFixed(1);
      if (Number(percentage) > 0) {
        setChildValueTotalYearMinus5("+" + percentage + " %");
      } else {
        setChildValueTotalYearMinus5(percentage + " %");
      }
    }
  }, [currentBranch, isYear, childValueTotalWithYear]);

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
            {isYear <= maxYearPossible - 2 && Plus2YearsPercentage ? (
              <p>
                {Plus2YearsPercentage}
                <span>vs {isYear + 2} </span>
              </p>
            ) : childValueTotalYearPlus2 ? (
              <p>
                {childValueTotalYearPlus2}
                <span>vs {isYear + 2} </span>
              </p>
            ) : (
              <></>
            )}
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
