import { Link } from "react-router-dom";
import "./Navbar.css";
import type { topicBranch } from "../../types/dataTypes";
import dropDownArrow from "../../assets/chevron-down.svg";
import { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import PublicSharpIcon from "@mui/icons-material/PublicSharp";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

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
  // à mettre en place une fois les données géographiques ajouter à la BDD pour activer le toggle boutton
  const [topicOrLocation, setTopicOrLocation] = useState(true);

  const changeParameter = () => {
    if (topicOrLocation === true) {
      setTopicOrLocation(false);
    } else {
      setTopicOrLocation(true);
    }
  };

  const years = topicOrigin.values.sort((a, b) => b[0] - a[0]);

  const [subject, setSubject] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSubject(event.target.value as string);
  };

  return (
    <>
      <section className="topNav">
        <Link to="/">
          <h1>Logo</h1>
        </Link>
        <ToggleButton
          value="bold"
          aria-label="bold"
          onClick={() => changeParameter()}
          disableRipple
          sx={{ border: "none", "&:hover": { bgcolor: "#77869f" } }}
          // borderRadius: "50%",
        >
          {topicOrLocation ? <AccountTreeOutlinedIcon /> : <PublicSharpIcon />}
        </ToggleButton>
        {/* à mettre en place une fois les données géographiques ajouter à la BDD */}
      </section>
      {currentBranch.unit !== "" && (
        <section className="navigation">
          <Box className="environnement_list">
            <FormControl fullWidth>
              <InputLabel>Environnement</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subject}
                label="sujet montrer"
                onChange={handleChange}
              >
                <MenuItem value="France">France</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box className="year_list">
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
