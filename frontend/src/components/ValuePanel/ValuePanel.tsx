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

  let minYearPossible = 0;
  if (currentBranch.values.length > 0) {
    minYearPossible = currentBranch.values[currentBranch.values.length - 1][0];
  }

  // taux d'évolution = (finale - initiale / initiale) * 100

  let Plus2YearsPercentage = "";
  if (currentBranch.values.length > 0 && isYear <= maxYearPossible - 2) {
    const currentPlus2Value = currentBranch.values.filter(
      (info) => info[0] === isYear + 2
    )[0][1];
    Plus2YearsPercentage =
      (
        ((currentPlus2Value - currentValue[0][1]) / currentValue[0][1]) *
        100
      ).toFixed(1) + " %";
  }

  let Minus2YearsPercentage = "";
  if (currentBranch.values.length > 0 && isYear - 2 >= minYearPossible) {
    const currentMinus2Value = currentBranch.values.filter(
      (info) => info[0] === isYear - 2
    )[0][1];
    Minus2YearsPercentage =
      (
        ((currentValue[0][1] - currentMinus2Value) / currentMinus2Value) *
        100
      ).toFixed(1) + " %";
  }

  let Minus5YearsPercentage = "";
  if (currentBranch.values.length > 0 && isYear - 5 >= minYearPossible) {
    const currentMinus5Value = currentBranch.values.filter(
      (info) => info[0] === isYear - 5
    )[0][1];
    Minus5YearsPercentage =
      (
        ((currentValue[0][1] - currentMinus5Value) / currentMinus5Value) *
        100
      ).toFixed(1) + " %";
  }

  return (
    <>
      {currentValue.length !== 0 && (
        <div className="branch_value">
          {currentValue.length !== 0 ? (
            <p>
              {parseFloat(currentValue[0][1].toFixed(2)) + " "}
              <span>{currentBranch.unit}</span>
            </p>
          ) : childValueTotalWithYear !== 0 ? (
            <p>
              {parseFloat(childValueTotalWithYear.toFixed(2)) + " "}
              <span>{currentBranch.unit}</span>
            </p>
          ) : (
            <></>
          )}
          <div className="value_evolution">
            {isYear <= maxYearPossible - 2 && Plus2YearsPercentage && (
              <p>
                {Plus2YearsPercentage}
                <span>vs {isYear + 2} </span>
              </p>
            )}
            {isYear - 2 >= minYearPossible && Minus2YearsPercentage && (
              <p>
                {Minus2YearsPercentage}
                <span>vs {isYear - 2} </span>
              </p>
            )}
            {isYear - 5 >= minYearPossible && Minus5YearsPercentage && (
              <p>
                {Minus5YearsPercentage}
                <span>vs {isYear - 5} </span>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
