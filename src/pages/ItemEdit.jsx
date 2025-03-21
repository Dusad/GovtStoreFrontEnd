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
  CircularProgress,
} from "@mui/material";

function ItemEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState({
    itemname: "",
    pageno: "",
    registerId: "",
  });

  const [registers, setRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🟢 Fetch Item & Registers
  useEffect(() => {
    const controller = new AbortController();
  
    const fetchData = async () => {
      try {
        setLoading(true);
        const itemRes = await fetch(`http://localhost:8080/item/${id}`, { signal: controller.signal });
        const regRes = await fetch("http://localhost:8080/allregister", { signal: controller.signal });
  
        if (!itemRes.ok || !regRes.ok) throw new Error("Failed to fetch data");
  
        const itemData = await itemRes.json();  // अब API सिर्फ ID भेजेगा
        const registersData = await regRes.json();
  
        setRegisters(registersData);
        setItem({
          itemname: itemData.itemname || "",
          pageno: itemData.pageno || "",
          registerId: itemData.registerId || "", // 🔹 अब सही से registerId आ जाएगा
        });
      } catch (err) {
        if (err.name !== "AbortError") setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  
    return () => controller.abort();
  }, [id]);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`http://localhost:8080/item/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!res.ok) throw new Error("Failed to update item");

      navigate("/items");
    } catch (err) {
      setError("Update failed! Try again.",err);
    }
  };

  // 🔵 Loading UI
  if (loading) return <Container sx={{ textAlign: "center", mt: 5 }}><CircularProgress /></Container>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: "bold", color: "primary.main" }}>
        Edit Item
      </Typography>

      {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}

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

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Register</InputLabel>
          <Select name="registerId" value={item.registerId} onChange={handleChange} required>
            {registers.map((reg) => (
              <MenuItem key={reg.id} value={reg.id}>{reg.rname}</MenuItem>
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