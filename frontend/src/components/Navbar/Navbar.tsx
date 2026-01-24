import "./Navbar.css";
import type { geoTopicBranch } from "../../types/dataTypes";
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
  topicOrLocation: boolean;
  setTopicOrLocation: React.Dispatch<React.SetStateAction<boolean>>;
  currentBranch: geoTopicBranch;
  setCurrentBranch: React.Dispatch<React.SetStateAction<geoTopicBranch>>;
  currentLocalisation: geoTopicBranch;
  setCurrentLocalisation: React.Dispatch<React.SetStateAction<geoTopicBranch>>;
  chosenPathStats: geoTopicBranch[];
  setChosenPathStats: React.Dispatch<React.SetStateAction<geoTopicBranch[]>>;
  chosenPathGeo: geoTopicBranch[];
  setChosenPathGeo: React.Dispatch<React.SetStateAction<geoTopicBranch[]>>;
  setPreviousBranchName: React.Dispatch<React.SetStateAction<string>>;
  setShowLineChart: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({
  isYear,
  setIsYear,
  topicOrLocation,
  setTopicOrLocation,
  currentBranch,
  setCurrentBranch,
  currentLocalisation,
  setCurrentLocalisation,
  chosenPathStats,
  setChosenPathStats,
  chosenPathGeo,
  setChosenPathGeo,
  setPreviousBranchName,
  setShowLineChart,
}: NavBarProps) {
  // changement entre localisation et Topic par le toggle bouton
  const changeParameter = () => {
    if (topicOrLocation === true) {
      setTopicOrLocation(false);
    } else {
      setTopicOrLocation(true);
      setChosenPathGeo([chosenPathGeo[0]]);
    }
  };

  // récupération de l'année des datas recherchée
  let years: [number, number][] = [];

  if (topicOrLocation) {
    if (currentBranch.values.length > 0) {
      years = currentBranch.values;
    } else if (
      currentBranch.children &&
      currentBranch.children[0].values.length > 0
    ) {
      years = currentBranch.children[0].values;
    }
  } else {
    if (
      currentBranch.values.length > 0 ||
      currentLocalisation.values.length > 0
    ) {
      years = currentBranch.values;
    } else if (
      currentLocalisation.children &&
      currentLocalisation.children[0] &&
      currentLocalisation.children[0].values.length > 0
    ) {
      years = currentLocalisation.children[0].values;
    }
  }

  // retour vers la branche initial
  const handleBackHome = () => {
    setCurrentBranch(chosenPathStats[0]);
    setChosenPathStats([chosenPathStats[0]]);
    setCurrentLocalisation(chosenPathGeo[0]);
    setChosenPathGeo([chosenPathGeo[0]]);
    setShowLineChart(false);

    if (!topicOrLocation) {
      setTopicOrLocation(true);
    }

    console.log(topicOrLocation);
  };

  console.log(topicOrLocation);

  return (
    <>
      <section className="topNav">
        <button
          type="button"
          className="logo_style"
          onClick={() => {
            handleBackHome();
          }}
        >
          <h1>Wikidata</h1>
        </button>
        <aside>
          <BrowsingDrawer
            chosenPathStats={chosenPathStats}
            setChosenPathStats={setChosenPathStats}
            chosenPathGeo={chosenPathGeo}
            setChosenPathGeo={setChosenPathGeo}
            setCurrentBranch={setCurrentBranch}
            setCurrentLocalisation={setCurrentLocalisation}
            setPreviousBranchName={setPreviousBranchName}
            setShowLineChart={setShowLineChart}
            topicOrLocation={topicOrLocation}
            setTopicOrLocation={setTopicOrLocation}
          />
          {((topicOrLocation && currentBranch.id.length > 15) ||
            (!topicOrLocation && currentLocalisation.id.length < 6)) && (
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
      {((topicOrLocation && currentBranch.id.length > 15) ||
        (!topicOrLocation && currentLocalisation.id.length < 6)) && (
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
            {!topicOrLocation
              ? currentBranch.name
              : chosenPathGeo.length > 1
                ? currentLocalisation.name
                : "FRANCE"}
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
