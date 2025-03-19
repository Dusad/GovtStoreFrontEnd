import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

function RegisterCreate() {
  const [rname, setRname] = useState("");
  const [rdisc, setRdisc] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registerData = { rname, rdisc };

    try {
      const response = await fetch("http://localhost:8080/createregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        setMessage("Register created successfully!");
        setRname("");
        setRdisc("");
      } else {
        setMessage("Failed to create register.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error!");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, p: 3, border: "1px solid #ddd", borderRadius: "8px", boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom>
        Create a Register
      </Typography>
      {message && <Typography color="primary">{message}</Typography>}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Register Name"
          fullWidth
          variant="outlined"
          value={rname}
          onChange={(e) => setRname(e.target.value)}
          required
          sx={{ p: 1, m: 1 }}
        />
        <TextField
          label="Description"
          fullWidth
          variant="outlined"
          value={rdisc}
          onChange={(e) => setRdisc(e.target.value)}
          required
          sx={{ p: 1, m: 1 }}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Create Register
        </Button>
      </Box>
    </Container>
  );
}

export default RegisterCreate;
