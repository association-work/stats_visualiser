import "./BreadCrumbs.css";
import type { topicBranch } from "../../types/dataTypes";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";

interface BreadCrumbsProps {
  chosenPath: topicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<topicBranch[]>>;
  setCurrentBranch: React.Dispatch<React.SetStateAction<topicBranch>>;
  setPreviousBranchName: React.Dispatch<React.SetStateAction<string>>;
}

export default function BreadCrumbs({
  chosenPath,
  setChosenPath,
  setCurrentBranch,
  setPreviousBranchName,
}: BreadCrumbsProps) {
  const handleRewindBranch = (index: number) => {
    setPreviousBranchName(chosenPath[chosenPath.length - 1].name);
    chosenPath.forEach((choice) => {
      setCurrentBranch(choice);
      let i = chosenPath.length - 1;
      while (i > index) {
        chosenPath.pop();
        i--;
      }
      setChosenPath(chosenPath);
    });
  };

  return (
    <section className="footer">
      <Breadcrumbs
        maxItems={2}
        aria-label="breadcrumb"
        separator={<ChevronRightOutlinedIcon />}
        sx={{
          marginBottom: "6px",
          marginTop: "6px",
          backgroundColor: "var(--bg-color-medium-ligth",
          borderRadius: "16px",
          padding: "8px",
          width: "93%",
          fontFamily: "var(--main-font)",
        }}
      >
        {chosenPath &&
          chosenPath.length > 0 &&
          chosenPath.map((choice, index) =>
            index === 0 ? (
              <Button
                variant="contained"
                key={index}
                onClick={() => handleRewindBranch(index)}
                sx={{
                  backgroundColor: "var(--bg-color-ligth-dark)",
                  minWidth: "20px",
                  padding: "7px 10px",
                  borderRadius: "8px",
                }}
              >
                <HomeOutlinedIcon />
              </Button>
            ) : (
              <Button
                variant="text"
                key={index}
                onClick={() => handleRewindBranch(index)}
                sx={{
                  border: " 1px solid var(--bg-color-ligth-dark)",
                  borderRadius: "8px",
                  color: "var(--bg-color-ligth-dark)",
                  fontFamily: "var(--main-font)",
                }}
              >
                <p>
                  {choice.name.length < 15
                    ? choice.name
                    : choice.name.slice(0, 20)}
                </p>
              </Button>
            )
          )}
      </Breadcrumbs>
    </section>
  );
}
