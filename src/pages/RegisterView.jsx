import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Paper, Typography, List, ListItem, ListItemText } from "@mui/material";

function RegisterView() {
  const { id } = useParams();
  const [register, setRegister] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/registers/${id}`)
      .then((res) => res.json())
      .then((data) => setRegister(data))
      .catch((err) => console.error("Error fetching register details:", err));
  }, [id]);

  if (!register) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
          Register Details
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          <strong>Name:</strong> {register.rname}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Description:</strong> {register.rdisc}
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold" }}>
          Items in this Register:
        </Typography>
        <List>
          {register.item && register.item.length > 0 ? (
            register.item.map((item) => (
              <ListItem key={item.id} sx={{ borderBottom: "1px solid #ddd" }}>
                <ListItemText primary={item.iname} secondary={item.idisc} />
              </ListItem>
            ))
          ) : (
            <Typography>No items found.</Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default RegisterView;
