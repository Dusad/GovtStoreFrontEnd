import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Menu as MenuIcon, ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* ☰ Menu Icon for Mobile */}
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ display: { md: "none", xs: "block" } }}>
          <MenuIcon />
        </IconButton>

        {/* 🏠 App Title */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Store Management
        </Typography>

        {/* 📌 Register Menu */}
        <Button
          color="inherit"
          onClick={handleMenuOpen}
          endIcon={<ExpandMore />}
        >
          Register
        </Button>

        {/* 🔽 Dropdown Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem component={Link} to="/register/create" onClick={handleMenuClose}>
            Create Register
          </MenuItem>
          <MenuItem component={Link} to="/register/manage" onClick={handleMenuClose}>
            Manage Register
          </MenuItem>
        </Menu>

        {/* Other Menus (Future) */}
        <Button color="inherit" component={Link} to="/items">
          Items
        </Button>
        <Button color="inherit" component={Link} to="/reports">
          Reports
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
