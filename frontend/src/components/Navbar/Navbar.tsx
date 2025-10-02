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
  setIsYear: React.Dispatch<React.SetStateAction<number>>;
  topicOrigin: topicBranch;
  currentBranch: topicBranch;
}

export default function Navbar({
  setIsYear,
  topicOrigin,
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

  const years = topicOrigin.values.sort((a, b) => b[0] - a[0]);

  return (
    <>
      <section className="topNav">
        <Link to="/">
          <h1>Logo</h1>
        </Link>
        {!currentBranch.id.includes("0_") && (
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
      {!currentBranch.id.includes("0_") && (
        <section className="navigation">
          <Button
            disabled
            variant="outlined"
            sx={{ borderRadius: "8px", width: "65%" }}
          >
            {topicOrLocation ? "DESTINATION" : currentBranch.name}
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
                defaultValue={""}
                sx={{ borderRadius: "8px" }}
              >
                {years &&
                  years.map((year) => (
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
