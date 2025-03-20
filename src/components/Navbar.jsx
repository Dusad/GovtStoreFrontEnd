import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Store Management
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/register/manage">Registers</Button>
          <Button color="inherit" component={Link} to="/items/manage">Items</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
