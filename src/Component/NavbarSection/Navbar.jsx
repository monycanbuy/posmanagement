import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import ChangePasswordDialog from "./ChangePasswordDialog";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#682396",
    color: "#f6f5f7",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  profileButton: {
    color: "#f6f5f7",
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
}));

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "#682396",
    color: "#f6f5f7",
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 6px 16px",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  color: "#f6f5f7",
  "&:hover": {
    backgroundColor: "#b12bf0",
    color: "#fff",
  },
}));

const Navbar = ({ handleDrawerToggle, userName, profileImage }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(true);
  };

  const handleCloseChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(false);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Dashboard
        </Typography>
        <div>
          <Button
            className={classes.profileButton}
            color="inherit"
            onClick={handleMenuClick}
            endIcon={<ArrowDropDownIcon />}
          >
            <Avatar src={profileImage} className={classes.avatar} />
            {userName}
          </Button>
          <StyledMenu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <StyledMenuItem
              onClick={() => {
                handleMenuClose();
                handleOpenChangePasswordDialog();
              }}
            >
              Change Password
            </StyledMenuItem>
            <StyledMenuItem onClick={handleMenuClose}>
              My account
            </StyledMenuItem>
            <StyledMenuItem onClick={handleMenuClose}>Logout</StyledMenuItem>
          </StyledMenu>
        </div>
      </Toolbar>
      <ChangePasswordDialog
        open={isChangePasswordDialogOpen}
        onClose={handleCloseChangePasswordDialog}
      />
    </AppBar>
  );
};

export default Navbar;
