import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button, Container, AppBar, Toolbar, Typography } from "@mui/material";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ItemList from "./pages/ItemList";
import ItemDetail from "./pages/ItemDetail";
import ItemIssue from "./pages/ItemIssue";
import "./index.css";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Store Management
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/register">Register</Button>
          <Button color="inherit" component={Link} to="/items">Items</Button>
          <Button color="inherit" component={Link} to="/issue">Issue</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/issue" element={<ItemIssue />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
