import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegisterManage from "./pages/RegisterManage";
import RegisterCreate from "./pages/RegisterCreate";
import RegisterEdit from "./pages/RegisterEdit";
import ItemManage from "./pages/ItemManage";
import ItemCreate from "./pages/ItemCreate";
import ItemEdit from "./pages/ItemEdit";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";

import { Container } from "@mui/material";

function App() {
  return (
    <Router>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register/manage" element={<RegisterManage />} />
          <Route path="/register/create" element={<RegisterCreate />} />
          <Route path="/register/edit/:id" element={<RegisterEdit />} />
          <Route path="/items/manage" element={<ItemManage />} />
          <Route path="/items/create" element={<ItemCreate />} />
          <Route path="/items/edit/:id" element={<ItemEdit />} />
          <Route path="/itemdetails" element={<ItemDetail />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
