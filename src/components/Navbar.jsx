import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/register/manage">
          <ListItemText primary="Registers" />
        </ListItem>
        <ListItem button component={Link} to="/items/manage">
          <ListItemText primary="Items" />
        </ListItem>
        {/* <ListItem button component={Link} to="/itemdetails">
          <ListItemText primary="Item Details" />
        </ListItem> */}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* ✅ Mobile Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Store Management
          </Typography>

          {/* ✅ Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/register/manage">Registers</Button>
            <Button color="inherit" component={Link} to="/items/manage">Items</Button>
            {/* <Button color="inherit" component={Link} to="/itemdetails">Item Details</Button> */}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;
