import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";

function RegisterEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rname, setRname] = useState("");
  const [rdisc, setRdisc] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/reg/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRname(data.rname);
        setRdisc(data.rdisc);
      })
      .catch(() => setMessage("Error fetching register details"));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = { rname, rdisc };

    try {
      const response = await fetch(`http://localhost:8080/reg/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setMessage("Register updated successfully!");
        setTimeout(() => navigate("/register/manage"), 1500);
      } else {
        setMessage("Update failed!");
      }
    } catch (error) {
      setMessage("Server error!",error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2, width: "100%", bgcolor: "#f9f9f9" }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
          Edit Register
        </Typography>
        {message && <Typography color="primary" sx={{ textAlign: "center", mb: 2 }}>{message}</Typography>}
        <form onSubmit={handleUpdate}>
          <TextField
            label="Register Name"
            fullWidth
            variant="outlined"
            value={rname}
            onChange={(e) => setRname(e.target.value)}
            required
            sx={{ mb: 3, p: 1 }}
          />
          <TextField
            label="Description"
            fullWidth
            variant="outlined"
            value={rdisc}
            onChange={(e) => setRdisc(e.target.value)}
            required
            sx={{ mb: 3, p: 1 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ p: 1.5 }}>
            Update Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default RegisterEdit;
