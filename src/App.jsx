import Navbar from "./components/Navbar";
import RegisterManage from "./pages/RegisterManage";
import RegisterCreate from "./pages/RegisterCreate";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register/manage" element={<RegisterManage />} />
        <Route path="/register/create" element={<RegisterCreate />} />
      </Routes>
    </Router>
  );
}

export default App;
