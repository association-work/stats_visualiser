import "./BreadCrumbs.css";
import type { topicBranch } from "../../types/dataTypes";

interface BreadCrumbsProps {
  chosenPath: topicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<topicBranch[]>>;
  setCurrentBranch: React.Dispatch<React.SetStateAction<topicBranch>>;
  setChartedDataTree: React.Dispatch<
    React.SetStateAction<{ name: string; value: number }[]>
  >;
  setChildValueTotalWithYear: React.Dispatch<React.SetStateAction<number>>;
}

export default function BreadCrumbs({
  chosenPath,
  setChosenPath,
  setCurrentBranch,
  setChartedDataTree,
  setChildValueTotalWithYear,
}: BreadCrumbsProps) {
  const handleRewindBranch = (index: number) => {
    chosenPath.forEach((choice) => {
      setCurrentBranch(choice);
      let i = chosenPath.length - 1;
      while (i > index) {
        chosenPath.pop();
        i--;
      }
      setChosenPath(chosenPath);
      setChartedDataTree([]);
      setChildValueTotalWithYear(0);
    });
  };

  return (
    <aside className="breadcrumbs">
      <section className="static_crumbs">
        {chosenPath &&
          chosenPath.length > 0 &&
          chosenPath.map((choice, index) => (
            <button
              type="button"
              className="crumbs"
              key={index}
              onClick={() => handleRewindBranch(index)}
              disabled={index === 0}
            >
              {choice.name.length < 15 ? choice.name : choice.name.slice(0, 15)}
            </button>
          ))}
      </section>
    </aside>
  );
}
