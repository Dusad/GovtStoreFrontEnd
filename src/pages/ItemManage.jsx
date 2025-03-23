import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  IconButton,
  Box,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit, ExpandMore, ExpandLess } from "@mui/icons-material";

const API_URL = "http://localhost:8080";

function ItemManage() {
  const [items, setItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/allitems`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data); // Debugging
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        setMessage("Error fetching items");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`${API_URL}/api/items/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");

      setItems(items.filter((item) => item.id !== id));
      setMessage("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      setMessage("Server error!");
    }
  };

  const handleExpandToggle = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", color: "primary.main" }}>
        Manage Items
      </Typography>

      {message && <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>{message}</Typography>}

      <Button variant="contained" color="success" component={Link} to="/items/create" sx={{ mb: 2 }}>
        + Create Item
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflowX: "auto" }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1976d2" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: 50 }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: 150 }}>Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: 100 }}>Page No</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: 150 }}>Register Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: 100 }}>Actions</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: 100 }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.itemname}</TableCell>
                    <TableCell>{item.pageno}</TableCell>
                    <TableCell>{item.registername}</TableCell>
                    <TableCell>
                      <IconButton color="primary" component={Link} to={`/items/edit/${item.id}`}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(item.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleExpandToggle(item.id)}>
                        {expandedItems[item.id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Row for Item Details */}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse in={expandedItems[item.id]} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: "#f0f0f0", borderRadius: 2 }}>
                          <Typography variant="h6">Item Details:</Typography>
                          {item.itemdetail?.length > 0 ? (
                            <TableContainer component={Paper} sx={{ mt: 1 }}>
                              <Table>
                                <TableHead>
                                  <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Issued</TableCell>
                                    <TableCell>Purchase Date</TableCell>
                                    <TableCell>Rate per Unit</TableCell>
                                    <TableCell>Item Issues</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {item.itemdetail.map((detail) => (
                                    <TableRow key={detail.id}>
                                      <TableCell>{detail.itemquantity}</TableCell>
                                      <TableCell>{detail.issuedquantity}</TableCell>
                                      <TableCell>{new Intl.DateTimeFormat("en-GB").format(new Date(detail.itempurchasedate))}</TableCell>
                                      <TableCell>{detail.rateperunit}</TableCell>
                                      <TableCell>
                                        {detail.itemissue?.length > 0 ? (
                                          <TableContainer component={Paper} sx={{ mt: 1 }}>
                                            <Table size="small">
                                              <TableHead>
                                                <TableRow sx={{ bgcolor: "#d0d0d0" }}>
                                                  <TableCell>Issued To</TableCell>
                                                  <TableCell>Return From</TableCell>
                                                  <TableCell>Issued Quantity</TableCell>
                                                  <TableCell>Issued Date</TableCell>
                                                  <TableCell>Return Date</TableCell>
                                                </TableRow>
                                              </TableHead>
                                              <TableBody>
                                                {detail.itemissue.map((issue) => (
                                                  <TableRow key={issue.id}>
                                                    <TableCell>{issue.issuedto || "-"}</TableCell>
                                                    <TableCell>{issue.returnfrom || "-"}</TableCell>
                                                    <TableCell>{issue.issuequan}</TableCell>
                                                    <TableCell>{issue.issuedate ? new Intl.DateTimeFormat("en-GB").format(new Date(issue.issuedate)) : "-"}</TableCell>
                                                    <TableCell>{issue.returndate ? new Intl.DateTimeFormat("en-GB").format(new Date(issue.returndate)) : "-"}</TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </TableContainer>
                                        ) : (
                                          "No Issues"
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Typography>No details available</Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default ItemManage;