import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

function ItemDetail({ itemId }) {
  const [itemDetails, setItemDetails] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/itemdetail/${itemId}`)
      .then((res) => res.json())
      .then((data) => setItemDetails(data))
      .catch((err) => console.error("Error fetching item details:", err));
  }, [itemId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2, fontWeight: "bold", color: "primary.main" }}>
        Item Details
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Issued</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Purchase Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Rate per Unit</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Item Issues</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Expand</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemDetails.length > 0 ? (
              itemDetails.map((detail) => (
                <React.Fragment key={detail.id}>
                  <TableRow>
                    <TableCell>{detail.itemquantity}</TableCell>
                    <TableCell>{detail.issuedquantity}</TableCell>
                    <TableCell>{new Date(detail.itempurchasedate).toLocaleDateString()}</TableCell>
                    <TableCell>{detail.rateperunit}</TableCell>
                    <TableCell>{detail.itemissue?.length || 0}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => setExpanded(!expanded)}>
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Row for Item Issues */}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: "#f0f0f0", borderRadius: 2 }}>
                          <Typography variant="h6">Item Issues:</Typography>
                          {detail.itemissue?.length > 0 ? (
                            <TableContainer component={Paper} sx={{ mt: 1 }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ bgcolor: "#e0e0e0" }}>
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
                            <Typography>No Issues</Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                  No item details available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ItemDetail;
