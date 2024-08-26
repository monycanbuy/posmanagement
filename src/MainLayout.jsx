// src/components/MainLayout.js

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Component/NavbarSection/Navbar";
import Sidebar from "./Component/NavbarSection/Sidebar";
import { makeStyles } from "@mui/styles";
import Footer from "./Component/AuthSection/FooterSection/Footer";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: "#fff",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: drawerWidth,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  mainContent: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: drawerWidth,
    marginTop: theme.mixins.toolbar.minHeight,
  },
}));

const MainLayout = () => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className={classes.root}>
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <Sidebar open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
      <main
        className={`${classes.content} ${
          drawerOpen ? classes.contentShift : ""
        }`}
      >
        <div className={classes.appBarSpacer} />
        <Outlet />
      </main>
      <div className={classes.footerSpacer}></div>
      <Footer />
    </div>
  );
};

export default MainLayout;
