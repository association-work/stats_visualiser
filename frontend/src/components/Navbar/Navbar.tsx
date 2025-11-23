import "./Navbar.css";
import type { topicBranch } from "../../types/dataTypes";
import ToggleButton from "@mui/material/ToggleButton";
import PublicSharpIcon from "@mui/icons-material/PublicSharp";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";
import BrowsingDrawer from "../BrowsingDrawer/BrowsingDrawer";

interface NavBarProps {
  isYear: number;
  setIsYear: React.Dispatch<React.SetStateAction<number>>;
  currentBranch: topicBranch;
  topicOrLocation: boolean;
  setTopicOrLocation: React.Dispatch<React.SetStateAction<boolean>>;
  chosenPath: topicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<topicBranch[]>>;
  setCurrentBranch: React.Dispatch<React.SetStateAction<topicBranch>>;
  setPreviousBranchName: React.Dispatch<React.SetStateAction<string>>;
  setShowLineChart: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({
  isYear,
  setIsYear,
  currentBranch,
  topicOrLocation,
  setTopicOrLocation,
  chosenPath,
  setChosenPath,
  setCurrentBranch,
  setPreviousBranchName,
  setShowLineChart,
}: NavBarProps) {
  const changeParameter = () => {
    if (topicOrLocation === true) {
      setTopicOrLocation(false);
    } else {
      setTopicOrLocation(true);
    }
  };

  let years: [number, number][] = [];

  if (currentBranch.values.length > 0) {
    years = currentBranch.values;
  } else {
    if (currentBranch.children && currentBranch.children[0].values.length > 0) {
      years = currentBranch.children[0].values;
    }
  }

  return (
    <>
      <section className="topNav">
        <button
          type="button"
          className="logo_style"
          onClick={() => {
            setChosenPath([chosenPath[0]]);
            setCurrentBranch(chosenPath[0]);
            setShowLineChart(false);
          }}
        >
          <h1>Numelys</h1>
        </button>
        <aside>
          <BrowsingDrawer
            chosenPath={chosenPath}
            setChosenPath={setChosenPath}
            setCurrentBranch={setCurrentBranch}
            setPreviousBranchName={setPreviousBranchName}
            setShowLineChart={setShowLineChart}
          />
          {currentBranch.id.length > 15 && (
            <ToggleButton
              value="bold"
              aria-label="bold"
              onClick={() => {
                changeParameter();
                setShowLineChart(false);
              }}
              disableRipple
              sx={{
                border: "none",
                "&:hover": { bgcolor: "var(--bg-color-medium)" },
              }}
            >
              {topicOrLocation ? (
                <AccountTreeOutlinedIcon />
              ) : (
                <PublicSharpIcon />
              )}
            </ToggleButton>
          )}
          {/* function d'appel à l'API à mettre en place une fois les données géographiques ajouter à la BDD */}
        </aside>
      </section>
      {currentBranch.id.length > 15 && (
        <section className="navigation">
          <Button
            disabled
            variant="outlined"
            sx={{
              borderRadius: "8px",
              width: "65%",
              fontFamily: "var(--main-font)",
            }}
          >
            {topicOrLocation ? "FRANCE" : currentBranch.name}
          </Button>
          <Box sx={{ width: "30%" }}>
            <FormControl fullWidth>
              <InputLabel>Année</InputLabel>
              <Select
                labelId="Year"
                id=""
                label="sujet montrer"
                onChange={(event) => {
                  setIsYear(Number(event.target.value));
                  setShowLineChart(false);
                }}
                value={isYear}
                sx={{ borderRadius: "8px", fontFamily: "var(--main-font)" }}
              >
                {years &&
                  years
                    .sort((a, b) => b[0] - a[0])
                    .map((year) => (
                      <MenuItem value={year[0]} key={year[0]}>
                        {year[0]}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </Box>
        </section>
      )}
    </>
  );
}
