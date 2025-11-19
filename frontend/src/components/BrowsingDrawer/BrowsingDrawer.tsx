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
import type { topicBranch } from "../../types/dataTypes";

interface BrowsingDrawerProps {
  chosenPath: topicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<topicBranch[]>>;
  setCurrentBranch: React.Dispatch<React.SetStateAction<topicBranch>>;
  setPreviousBranchName: React.Dispatch<React.SetStateAction<string>>;
  setShowLineChart: React.Dispatch<React.SetStateAction<boolean>>;
  setTopicOrLocation: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BrowsingDrawer({
  chosenPath,
  setChosenPath,
  setCurrentBranch,
  setPreviousBranchName,
  setShowLineChart,
  setTopicOrLocation,
}: BrowsingDrawerProps) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
    setShowLineChart(false);
  };

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

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {chosenPath &&
          chosenPath.length > 0 &&
          chosenPath.map((choice, index) =>
            index === 0 ? (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleRewindBranch(index), setTopicOrLocation(true);
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
            )
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
        {DrawerList}
      </Drawer>
    </>
  );
}
