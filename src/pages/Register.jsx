import React from 'react'
import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";

function Register() {
  const [rname, setRname] = useState("");
  const [rdisc, setRdisc] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registerData = { rname, rdisc };

    try {
      const response = await fetch("http://localhost:8080/api/registers", {
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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create a Register
      </Typography>
      {message && <Typography color="primary">{message}</Typography>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Register Name"
          fullWidth
          variant="outlined"
          value={rname}
          onChange={(e) => setRname(e.target.value)}
          required
        />
        <TextField
          label="Description"
          fullWidth
          variant="outlined"
          value={rdisc}
          onChange={(e) => setRdisc(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Create Register
        </Button>
      </form>
    </Container>
  );
}

export default Register;
