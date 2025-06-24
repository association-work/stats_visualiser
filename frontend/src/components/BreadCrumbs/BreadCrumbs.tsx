import type { branch } from "../../types/dataTypes";
import "./BreadCrumbs.css";

interface BreadCrumbsProps {
  chosenPath: string[];
  setChosenPath: any;
  setCurrentBranch: any;
  entireTree: branch;
}

export default function BreadCrumbs({
  chosenPath,
  setChosenPath,
  setCurrentBranch,
  entireTree,
}: BreadCrumbsProps) {
  const handleRewindBranch = (index: number) => {
    chosenPath.map((choice, id) => {
      if (id === index) {
        if (id === 0) {
          setCurrentBranch(entireTree);
          setChosenPath([`${entireTree.name}`]);
        }
        // function isName(data: branch) {
        //   return data.name === choice;
        // }
        // if (id === 1) {
        //   setCurrentBranch(entireTree.children.find(isName));
        // }
        // if (id === 2) {
        //   for (let i = 0; i < entireTree.children.length; i++) {
        //     for (let j = 0; j < entireTree.children[i].children.length; j++) {
        //       setCurrentBranch(entireTree.children[i].children.find(isName));
        //     }
        //   }
        // }
        let i = chosenPath.length - 1;
        while (i > id) {
          chosenPath.pop();
          console.log(chosenPath);
          i--;
        }
        setChosenPath(chosenPath);
      }
    });
  };
  return (
    <aside className="breadcrumbs">
      <section className="static_crumbs">
        {chosenPath.length > 0 &&
          chosenPath.map((choice, index) => (
            <button
              type="button"
              className="crumbs"
              key={index}
              onClick={() => handleRewindBranch(index)}
            >
              {choice}
            </button>
          ))}
      </section>
    </aside>
  );
}
