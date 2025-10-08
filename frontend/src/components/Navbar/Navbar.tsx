import { Link } from "react-router-dom";
import "./Navbar.css";
import type { topicBranch } from "../../types/dataTypes";
import { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import PublicSharpIcon from "@mui/icons-material/PublicSharp";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";

interface NavBarProps {
  isYear: number;
  setIsYear: React.Dispatch<React.SetStateAction<number>>;
  currentBranch: topicBranch;
}

export default function Navbar({
  isYear,
  setIsYear,
  currentBranch,
}: NavBarProps) {
  const [topicOrLocation, setTopicOrLocation] = useState(true);

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
        <Link to="/">
          <h1>Logo</h1>
        </Link>
        {currentBranch.id.length > 15 && (
          <ToggleButton
            value="bold"
            aria-label="bold"
            onClick={() => changeParameter()}
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
