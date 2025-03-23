import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { MoreVert, Edit, Delete, Visibility } from "@mui/icons-material";

function ItemDetail() {
  const [items, setItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/allitemdetail")
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleMenuClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    setViewDialogOpen(true);
    handleClose();
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleClose();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Item Details</h1>
      <TableContainer component={Paper} className="shadow-lg">
        <Table>
          <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
            <TableRow>
              <TableCell className="font-bold">ID</TableCell>
              <TableCell className="font-bold">Quantity</TableCell>
              <TableCell className="font-bold">Issued</TableCell>
              <TableCell className="font-bold">Purchase Date</TableCell>
              <TableCell className="font-bold">Rate Per Unit</TableCell>
              <TableCell className="font-bold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.itemquantity}</TableCell>
                <TableCell>{item.issuedquantity}</TableCell>
                <TableCell>
                  {new Date(item.itempurchasedate).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.rateperunit}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, item)}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedItem?.id === item.id}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleView}>
                      <Visibility className="mr-2" /> View
                    </MenuItem>
                    <MenuItem onClick={handleEdit}>
                      <Edit className="mr-2" /> Edit
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Delete className="mr-2" /> Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" className="mt-4">
        Add Item
      </Button>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
        <DialogTitle>Item Details</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <div>
              <p><strong>ID:</strong> {selectedItem.id}</p>
              <p><strong>Quantity:</strong> {selectedItem.itemquantity}</p>
              <p><strong>Issued:</strong> {selectedItem.issuedquantity}</p>
              <p><strong>Purchase Date:</strong> {new Date(selectedItem.itempurchasedate).toLocaleDateString()}</p>
              <p><strong>Rate Per Unit:</strong> {selectedItem.rateperunit}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <p>यहाँ Edit Form आएगा</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={() => alert("Save Function")} color="secondary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ItemDetail;
