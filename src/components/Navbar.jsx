import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();  // इवेंट बबलिंग रोकने के लिए
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
        <ListItem button onClick={handleMenuOpen}>
          <ListItemText primary="Items" />
          <ArrowDropDownIcon />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
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

          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/register/manage">Registers</Button>
            <Button color="inherit" onClick={handleMenuOpen}>
              Items <ArrowDropDownIcon />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>

      {/* Menu को Drawer के बाहर रखना सही रहेगा */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem component={Link} to="/items/manage" onClick={handleMenuClose}>Item Manage</MenuItem>
        <MenuItem component={Link} to="/itemdetails" onClick={handleMenuClose}>Item Details</MenuItem>
        <MenuItem component={Link} to="/issueitems" onClick={handleMenuClose}>Issue Item</MenuItem>
      </Menu>
    </>
  );
}

export default Navbar;
