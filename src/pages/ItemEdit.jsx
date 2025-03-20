import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

function ItemEdit() {
  const { id } = useParams(); // URL से ID प्राप्त करें
  const navigate = useNavigate();

  const [item, setItem] = useState({
    itemname: "",
    pageno: "",
    registerId: "",
  });

  const [registers, setRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 🔹 1. API Call: Existing Item Details Fetch करें
  useEffect(() => {
    fetch(`http://localhost:8080/item/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem({
          itemname: data.itemname || "",
          pageno: data.pageno || "",
          registerId: data.register?.id || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setMessage("Error fetching item data.");
        setLoading(false);
      });

    // 🔹 2. API Call: सभी Registers को लाएं
    fetch("http://localhost:8080/allregister")
      .then((res) => res.json())
      .then((data) => setRegisters(data))
      .catch(() => setMessage("Error fetching registers."));
  }, [id]);

  // 🔹 3. Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  // 🔹 4. Form Submit (PUT API)
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    fetch(`http://localhost:8080/item/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((res) => {
        if (res.ok) {
          setMessage("Item updated successfully!");
          setTimeout(() => navigate("/items"), 2000);
        } else {
          setMessage("Failed to update item.");
        }
      })
      .catch(() => setMessage("Server error!"));
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", color: "primary.main" }}>
        Edit Item
      </Typography>

      {message && <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>{message}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Item Name"
          name="itemname"
          value={item.itemname}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Page No"
          name="pageno"
          value={item.pageno}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        {/* Register Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Register</InputLabel>
          <Select name="registerId" value={item.registerId} onChange={handleChange} required>
            {registers.map((reg) => (
              <MenuItem key={reg.id} value={reg.id}>
                {reg.rname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
            Update Item
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/items/manage")}>
            Cancel
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default ItemEdit;
