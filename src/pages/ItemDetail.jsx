import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Collapse,
  CircularProgress,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

const ItemDetails = () => {
  const [registers, setRegisters] = useState([]);
  const [selectedRegister, setSelectedRegister] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingItemDetails, setLoadingItemDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    itemname: "",
    pageno: "",
    itemquantity: "",
    rateperunit: "",
    itempurchasedate: new Date().toISOString().split('T')[0],
  });
  const [editItem, setEditItem] = useState({
    id: "",
    itemname: "",
    pageno: "",
    itemquantity: "",
    rateperunit: "",
    itempurchasedate: "",
  });
  const [itemToDelete, setItemToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ API से सभी Registers लोड करें
  useEffect(() => {
    fetch("http://localhost:8080/allregister")
      .then((res) => res.json())
      .then((data) => setRegisters(data))
      .catch((err) => console.error("Error loading registers:", err));
  }, []);

  // ✅ चुने गए Register के Items लोड करें
  useEffect(() => {
    if (selectedRegister) {
      setLoadingItems(true);
      fetch(`http://localhost:8080/reg/item/${selectedRegister}`)
        .then((res) => res.json())
        .then((data) => {
          setItems(data);
          setLoadingItems(false);
        })
        .catch((err) => {
          console.error("Error loading items:", err);
          setLoadingItems(false);
        });
    } else {
      setItems([]);
    }
  }, [selectedRegister]);

  // ✅ चुने गए Item की डिटेल्स लोड करें
  const toggleItemDetails = (itemId) => {
    if (expandedItemId === itemId) {
      setExpandedItemId(null);
      setSelectedItem(null);
    } else {
      setExpandedItemId(itemId);
      setLoadingItemDetails(true);

      fetch(`http://localhost:8080/itemdetailbyitemid/${itemId}`)
        .then((res) => res.text())
        .then((text) => {
          try {
            const data = JSON.parse(text);
            setSelectedItem(data);
          } catch (error) {
            console.error("Invalid JSON Response:", error + text);
            setSelectedItem(null);
          }
          setLoadingItemDetails(false);
        })
        .catch((err) => {
          console.error("Error loading item details:", err);
          setLoadingItemDetails(false);
        });
    }
  };

  // ✅ Add new item
  const handleAddItem = () => {
    if (!selectedRegister) {
      setSnackbar({
        open: true,
        message: "Please select a register first",
        severity: "error",
      });
      return;
    }

    const itemData = {
      ...newItem,
      registerid: selectedRegister,
    };

    fetch("http://localhost:8080/item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    })
      .then((res) => res.json())
      .then((data) => {
        setSnackbar({
          open: true,
          message: "Item added successfully!",
          severity: "success",
        });
        setOpenAddDialog(false);
        setNewItem({
          itemname: "",
          pageno: "",
          itemquantity: "",
          rateperunit: "",
          itempurchasedate: new Date().toISOString().split('T')[0],
        });
        // Refresh items list
        fetch(`http://localhost:8080/reg/item/${selectedRegister}`)
          .then((res) => res.json())
          .then((data) => setItems(data));
      })
      .catch((err) => {
        console.error("Error adding item:", err);
        setSnackbar({
          open: true,
          message: "Failed to add item",
          severity: "error",
        });
      });
  };

  // ✅ Edit item
  const handleEditItem = () => {
    fetch(`http://localhost:8080/item/${editItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editItem),
    })
      .then((res) => res.json())
      .then((data) => {
        setSnackbar({
          open: true,
          message: "Item updated successfully!",
          severity: "success",
        });
        setOpenEditDialog(false);
        // Refresh items list
        fetch(`http://localhost:8080/reg/item/${selectedRegister}`)
          .then((res) => res.json())
          .then((data) => setItems(data));
      })
      .catch((err) => {
        console.error("Error updating item:", err);
        setSnackbar({
          open: true,
          message: "Failed to update item",
          severity: "error",
        });
      });
  };

  // ✅ Delete item
  const handleDeleteItem = () => {
    fetch(`http://localhost:8080/item/${itemToDelete}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setSnackbar({
            open: true,
            message: "Item deleted successfully!",
            severity: "success",
          });
          setOpenDeleteDialog(false);
          // Refresh items list
          fetch(`http://localhost:8080/reg/item/${selectedRegister}`)
            .then((res) => res.json())
            .then((data) => setItems(data));
        } else {
          throw new Error("Failed to delete item");
        }
      })
      .catch((err) => {
        console.error("Error deleting item:", err);
        setSnackbar({
          open: true,
          message: "Failed to delete item",
          severity: "error",
        });
      });
  };

  // ✅ Open edit dialog
  const handleOpenEditDialog = (item) => {
    setEditItem({
      id: item.id,
      itemname: item.itemname,
      pageno: item.pageno,
      itemquantity: item.itemquantity || "",
      rateperunit: item.rateperunit || "",
      itempurchasedate: item.itempurchasedate ? item.itempurchasedate.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setOpenEditDialog(true);
  };

  // ✅ Open delete dialog
  const handleOpenDeleteDialog = (itemId) => {
    setItemToDelete(itemId);
    setOpenDeleteDialog(true);
  };

  // ✅ Search Functionality
  const filteredItems = items.filter((item) =>
    item.itemname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Sorting Functionality
  const sortedItems = React.useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredItems, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* 🔹 ComboBox और Search Box एक लाइन में */}
      <Grid container spacing={2} alignItems="center" className="mb-6">
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Select Register</InputLabel>
            <Select
              value={selectedRegister}
              onChange={(e) => setSelectedRegister(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon className="text-gray-500" />
                </InputAdornment>
              }
            >
              {registers.length > 0 ? (
                registers.map((reg) => (
                  <MenuItem key={reg.id} value={reg.id}>
                    {reg.rname}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Registers Found</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search Items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-500" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} className="text-right">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            className="mr-2"
          >
            Add Item
          </Button>
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedRegister("");
              setSearchQuery("");
              setItems([]);
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* 🔹 Table for Items */}
      {selectedRegister && (
        <TableContainer component={Paper} className="shadow-xl rounded-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-md">
                <TableCell
                  className="text-white font-bold uppercase cursor-pointer hover:bg-blue-700 transition-all"
                  onClick={() => requestSort("id")}
                >
                  <div className="flex items-center">
                    Item ID
                    {sortConfig.key === "id" && (
                      <span className="ml-2">
                        {sortConfig.direction === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell
                  className="text-white font-bold uppercase cursor-pointer hover:bg-blue-700 transition-all"
                  onClick={() => requestSort("itemname")}
                >
                  <div className="flex items-center">
                    Item Name
                    {sortConfig.key === "itemname" && (
                      <span className="ml-2">
                        {sortConfig.direction === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell
                  className="text-white font-bold uppercase cursor-pointer hover:bg-blue-700 transition-all"
                  onClick={() => requestSort("pageno")}
                >
                  <div className="flex items-center">
                    Register PageNo.
                    {sortConfig.key === "pageno" && (
                      <span className="ml-2">
                        {sortConfig.direction === "asc" ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-white font-bold uppercase text-center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingItems ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    <CircularProgress className="text-blue-600" />
                  </TableCell>
                </TableRow>
              ) : sortedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-red-500">
                    No Items Found!
                  </TableCell>
                </TableRow>
              ) : (
                sortedItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow className="hover:bg-gray-100 transition-all">
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.itemname}</TableCell>
                      <TableCell>{item.pageno}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="contained"
                            className={`${
                              expandedItemId === item.id
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            endIcon={<ExpandMoreIcon />}
                            onClick={() => toggleItemDetails(item.id)}
                          >
                            {expandedItemId === item.id ? "Hide Details" : "View Details"}
                          </Button>
                          <IconButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditDialog(item);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDeleteDialog(item.id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* 🔹 Expandable Details Section */}
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <Collapse in={expandedItemId === item.id} timeout="auto" unmountOnExit>
                          <div className="p-4 bg-blue-50 rounded-md shadow-inner">
                            {loadingItemDetails ? (
                              <Typography className="text-blue-600 text-center">
                                <CircularProgress size={24} className="mr-2" />
                                Loading Item Details...
                              </Typography>
                            ) : selectedItem ? (
                              <>
                                <Typography variant="h6" className="mb-2 text-blue-800 font-semibold">
                                  Item Details
                                </Typography>
                                <div className="grid grid-cols-2 gap-4">
                                  <Typography>
                                    <span className="font-semibold">Quantity:</span> {selectedItem.itemquantity}
                                  </Typography>
                                  <Typography>
                                    <span className="font-semibold">Issued:</span> {selectedItem.issuedquantity}
                                  </Typography>
                                  <Typography>
                                    <span className="font-semibold">Purchase Date:</span>{" "}
                                    {new Date(selectedItem.itempurchasedate).toLocaleString()}
                                  </Typography>
                                  <Typography>
                                    <span className="font-semibold">Rate per Unit:</span> ₹{selectedItem.rateperunit}
                                  </Typography>
                                </div>

                                {/* 🔹 Issued Details Table */}
                                {selectedItem.itemissue?.length > 0 ? (
                                  <TableContainer component={Paper} className="mt-2 shadow-lg">
                                    <Table>
                                      <TableHead className="bg-blue-800">
                                        <TableRow>
                                          <TableCell className="text-white">ID</TableCell>
                                          <TableCell className="text-white">Issued To</TableCell>
                                          <TableCell className="text-white">Return From</TableCell>
                                          <TableCell className="text-white">Issue Quantity</TableCell>
                                          <TableCell className="text-white">Issue Date</TableCell>
                                          <TableCell className="text-white">Return Date</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {selectedItem.itemissue.map((issue) => (
                                          <TableRow key={issue.id}>
                                            <TableCell>{issue.id}</TableCell>
                                            <TableCell>{issue.issuedto || "-"}</TableCell>
                                            <TableCell>{issue.returnfrom || "-"}</TableCell>
                                            <TableCell>{issue.issuequan}</TableCell>
                                            <TableCell>{issue.issuedate ? new Date(issue.issuedate).toLocaleString() : "-"}</TableCell>
                                            <TableCell>{issue.returndate ? new Date(issue.returndate).toLocaleString() : "-"}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                ) : (
                                  <Typography className="text-red-500 text-center mt-4">
                                    No Issued Details Available!
                                  </Typography>
                                )}
                              </>
                            ) : null}
                          </div>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Item Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <TextField
              label="Item Name"
              value={newItem.itemname}
              onChange={(e) => setNewItem({ ...newItem, itemname: e.target.value })}
              fullWidth
            />
            <TextField
              label="Page Number"
              type="number"
              value={newItem.pageno}
              onChange={(e) => setNewItem({ ...newItem, pageno: e.target.value })}
              fullWidth
            />
            <TextField
              label="Quantity"
              type="number"
              value={newItem.itemquantity}
              onChange={(e) => setNewItem({ ...newItem, itemquantity: e.target.value })}
              fullWidth
            />
            <TextField
              label="Rate per Unit"
              type="number"
              value={newItem.rateperunit}
              onChange={(e) => setNewItem({ ...newItem, rateperunit: e.target.value })}
              fullWidth
            />
            <TextField
              label="Purchase Date"
              type="date"
              value={newItem.itempurchasedate}
              onChange={(e) => setNewItem({ ...newItem, itempurchasedate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleAddItem}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <TextField
              label="Item Name"
              value={editItem.itemname}
              onChange={(e) => setEditItem({ ...editItem, itemname: e.target.value })}
              fullWidth
            />
            <TextField
              label="Page Number"
              type="number"
              value={editItem.pageno}
              onChange={(e) => setEditItem({ ...editItem, pageno: e.target.value })}
              fullWidth
            />
            <TextField
              label="Quantity"
              type="number"
              value={editItem.itemquantity}
              onChange={(e) => setEditItem({ ...editItem, itemquantity: e.target.value })}
              fullWidth
            />
            <TextField
              label="Rate per Unit"
              type="number"
              value={editItem.rateperunit}
              onChange={(e) => setEditItem({ ...editItem, rateperunit: e.target.value })}
              fullWidth
            />
            <TextField
              label="Purchase Date"
              type="date"
              value={editItem.itempurchasedate}
              onChange={(e) => setEditItem({ ...editItem, itempurchasedate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleEditItem}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteItem}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ItemDetails;