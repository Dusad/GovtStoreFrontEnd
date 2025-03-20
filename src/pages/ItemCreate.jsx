import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, MenuItem, Typography, Paper } from "@mui/material";

function ItemCreate() {
  const navigate = useNavigate();
  const [registers, setRegisters] = useState([]); // सभी Registers लाने के लिए
  const [item, setItem] = useState({
    itemname: "",
    pageno: "",
    registerId: "",
  });

  const [message, setMessage] = useState("");

  // 📌 सभी Registers लाने के लिए API Call
  useEffect(() => {
    fetch("http://localhost:8080/allregister")
      .then((res) => res.json())
      .then((data) => setRegisters(data))
      .catch(() => setMessage("Error fetching registers"));
  }, []);

  // 📌 Input Fields Handle करने के लिए
  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  // 📌 Item को Create करने के लिए API Call
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.registerId) {
      setMessage("Please select a register.");
      return;
    }

    const newItem = {
      itemname: item.itemname,
      pageno: item.pageno,
      register: { id: item.registerId }, // Backend के अनुसार Register Object भेजना जरूरी है
    };

    try {
      const response = await fetch("http://localhost:8080/enteritems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        setMessage("Item created successfully!");
        setTimeout(() => navigate("/items/manage"), 1500); // ✅ Success होने पर Redirect करें
      } else {
        setMessage("Failed to create item!");
      }
    } catch (error) {
      setMessage("Server error!",error);
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen bg-gray-100">
      <Paper className="p-6 w-96 shadow-lg">
        <Typography variant="h5" className="text-center mb-4 text-blue-600 font-bold">
          Create New Item
        </Typography>

        {message && <Typography className="text-red-500 text-center mb-2">{message}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Item Name"
            name="itemname"
            value={item.itemname}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Page No"
            name="pageno"
            value={item.pageno}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          {/* 📌 Register Dropdown */}
          <TextField
            select
            label="Select Register"
            name="registerId"
            value={item.registerId}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            {registers.map((reg) => (
              <MenuItem key={reg.id} value={reg.id}>
                {reg.rname}
              </MenuItem>
            ))}
          </TextField>

          <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4">
            Create Item
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default ItemCreate;
