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
  //useMediaQuery
} from "@mui/material";
import { Delete, Edit, ExpandMore, ExpandLess } from "@mui/icons-material";

function ItemManage() {
  const [items, setItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [message, setMessage] = useState("");
 // const isMobile = useMediaQuery("(max-width:768px)"); // ✅ Mobile View Check

  useEffect(() => {
    fetch("http://localhost:8080/allitems")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => setMessage("Error fetching items"));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/items/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setItems(items.filter((item) => item.id !== id));
          setMessage("Item deleted successfully!");
        } else {
          setMessage("Delete failed!");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        setMessage("Server error!");
      }
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

      {/* ✅ Table को Scrollable बनाना */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflowX: "auto" }}>
        <Table sx={{ minWidth: 600 }}>  {/* ✅ Min Width Set */}
          <TableHead>
            <TableRow sx={{ bgcolor: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: 50 }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: 150 }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: 100 }}>Page No</TableCell>
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
                  <TableCell colSpan={5} sx={{ p: 0 }}>
                    <Collapse in={expandedItems[item.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2, bgcolor: "#f0f0f0", borderRadius: 2 }}>
                        <Typography variant="h6">Item Details:</Typography>
                        {item.itemdetail && item.itemdetail.length > 0 ? (
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
                                  <React.Fragment key={detail.id}>
                                    <TableRow>
                                      <TableCell>{detail.itemquantity}</TableCell>
                                      <TableCell>{detail.issuedquantity}</TableCell>
                                      <TableCell>{new Date(detail.itempurchasedate).toLocaleDateString()}</TableCell>
                                      <TableCell>{detail.rateperunit}</TableCell>
                                      <TableCell>
                                        {detail.itemissue && detail.itemissue.length > 0 ? (
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
                                                    <TableCell>
                                                      {issue.issuedate ? new Date(issue.issuedate).toLocaleDateString() : "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                      {issue.returndate ? new Date(issue.returndate).toLocaleDateString() : "-"}
                                                    </TableCell>
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
                                  </React.Fragment>
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
    </Box>
  );
}

export default ItemManage;
