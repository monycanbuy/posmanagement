import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { Store } from "@mui/icons-material";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#682396", // Set background color to #682396
    color: "#f6f5f7", // Set text color to #f6f5f7
  },
  toolbar: theme.mixins.toolbar,
  listItemIcon: {
    color: "#f6f5f7", // Set icon color to #f6f5f7
  },
  listItemText: {
    color: "#f6f5f7", // Set text color to #f6f5f7
  },
  listItem: {
    "&:hover": {
      backgroundColor: "#b12bf0", // Set background color on hover to #b12bf0
      color: "#fff", // Set text color on hover to #fff
    },
  },
  listItemIconHover: {
    "&:hover": {
      color: "#fff", // Set icon color on hover to #fff
    },
  },
}));

const Sidebar = ({ open, handleDrawerToggle }) => {
  const classes = useStyles();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleNavigation = (path) => {
    navigate(path); // Programmatically navigate to the specified path
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List>
        <Link
          to="/customer"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem button key="Customers" className={classes.listItem}>
            <ListItemIcon
              className={`${classes.listItemIcon} ${classes.listItemIconHover}`}
            >
              <InboxIcon />
            </ListItemIcon>
            <ListItemText
              primary="Customers"
              className={classes.listItemText}
            />
          </ListItem>
        </Link>
        <Link to="/users" style={{ textDecoration: "none", color: "inherit" }}>
          <ListItem button key="Users" className={classes.listItem}>
            <ListItemIcon
              className={`${classes.listItemIcon} ${classes.listItemIconHover}`}
            >
              <Store />
            </ListItemIcon>
            <ListItemText
              primary="Manage Users"
              className={classes.listItemText}
            />
          </ListItem>
        </Link>

        {/* {[
          { text: "Manage Users", path: "/users" }, // Added User route
          { text: "Customer", path: "/customer" },
          { text: "Starred", path: "/starred" },
          { text: "Send email", path: "/send-email" },
          { text: "Drafts", path: "/drafts" },
        ].map((item, index) => (
          <ListItem
            button
            key={item.text}
            className={classes.listItem}
            onClick={() => handleNavigation(item.path)} // Handle click event
          >
            <ListItemIcon
              className={`${classes.listItemIcon} ${classes.listItemIconHover}`}
            >
              <InboxIcon />
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              className={classes.listItemText}
            />
          </ListItem>
        ))} */}
      </List>
    </Drawer>
  );
};

export default Sidebar;
