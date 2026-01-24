import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import type { geoTopicBranch } from "../../types/dataTypes";

interface BrowsingDrawerProps {
  setCurrentBranch: React.Dispatch<React.SetStateAction<geoTopicBranch>>;
  setCurrentLocalisation: React.Dispatch<React.SetStateAction<geoTopicBranch>>;
  chosenPathStats: geoTopicBranch[];
  setChosenPathStats: React.Dispatch<React.SetStateAction<geoTopicBranch[]>>;
  chosenPathGeo: geoTopicBranch[];
  setChosenPathGeo: React.Dispatch<React.SetStateAction<geoTopicBranch[]>>;
  setPreviousBranchName: React.Dispatch<React.SetStateAction<string>>;
  setShowLineChart: React.Dispatch<React.SetStateAction<boolean>>;
  topicOrLocation: boolean;
  setTopicOrLocation: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BrowsingDrawer({
  setCurrentBranch,
  setCurrentLocalisation,
  chosenPathStats,
  setChosenPathStats,
  chosenPathGeo,
  setChosenPathGeo,
  setPreviousBranchName,
  setShowLineChart,
  topicOrLocation,
  setTopicOrLocation,
}: BrowsingDrawerProps) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
    setShowLineChart(false);
  };

  const handleRewindBranch = (index: number) => {
    if (topicOrLocation) {
      setPreviousBranchName(chosenPathStats[chosenPathStats.length - 1].name);
      chosenPathStats.forEach((choice) => {
        setCurrentBranch(choice);
        let i = chosenPathStats.length - 1;
        while (i > index) {
          chosenPathStats.pop();
          i--;
        }
        setChosenPathStats(chosenPathStats);
      });
    } else {
      setPreviousBranchName(chosenPathGeo[chosenPathGeo.length - 1].name);
      chosenPathGeo.forEach((choice) => {
        setCurrentLocalisation(choice);
        let i = chosenPathGeo.length - 1;
        while (i > index) {
          chosenPathGeo.pop();
          i--;
        }
        setChosenPathGeo(chosenPathGeo);
      });
    }
  };

  const DrawerListStats = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {chosenPathStats &&
          chosenPathStats.length > 0 &&
          chosenPathStats.map((choice, index) =>
            index === 0 ? (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    (handleRewindBranch(index), setTopicOrLocation(true));
                  }}
                  sx={{
                    padding: "7px 10px",
                  }}
                >
                  <ListItemIcon>
                    <HomeOutlinedIcon
                      sx={{
                        color: "var(--highligth-color)",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleRewindBranch(index)}
                  sx={{
                    color: "var(--bg-color-ligth-dark)",
                  }}
                >
                  <p>
                    {choice.name.length < 15
                      ? choice.name
                      : choice.name.slice(0, 20)}
                  </p>
                </ListItemButton>
              </ListItem>
            ),
          )}
      </List>
    </Box>
  );

  const DrawerListGeo = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {chosenPathGeo &&
          chosenPathGeo.length > 0 &&
          chosenPathGeo.map((choice, index) =>
            index === 0 ? (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    (handleRewindBranch(index), setTopicOrLocation(true));
                  }}
                  sx={{
                    padding: "7px 10px",
                  }}
                >
                  <ListItemIcon>
                    <HomeOutlinedIcon
                      sx={{
                        color: "var(--highligth-color)",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleRewindBranch(index)}
                  sx={{
                    color: "var(--bg-color-ligth-dark)",
                  }}
                >
                  <p>
                    {choice.name.length < 15
                      ? choice.name
                      : choice.name.slice(0, 20)}
                  </p>
                </ListItemButton>
              </ListItem>
            ),
          )}
      </List>
    </Box>
  );

  return (
    <>
      <Button onClick={toggleDrawer(true)}>
        <ManageSearchIcon
          sx={{
            color: "var(--highligth-color)",
            width: "30px",
            height: "30px",
          }}
        />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {topicOrLocation ? DrawerListStats : DrawerListGeo}
      </Drawer>
    </>
  );
}
