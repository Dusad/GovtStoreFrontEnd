import React, { useEffect, useState, useMemo } from "react";
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
  const [loading, setLoading] = useState({ items: false, details: false });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [dialog, setDialog] = useState({ 
    add: false, 
    edit: false, 
    delete: false 
  });
  const [formData, setFormData] = useState({
    add: {
      itemname: "",
      pageno: "",
      itemquantity: "",
      rateperunit: "",
      itempurchasedate: new Date().toISOString().split('T')[0],
    },
    edit: {
      id: "",
      itemname: "",
      pageno: "",
      itemquantity: "",
      rateperunit: "",
      itempurchasedate: "",
    }
  });
  const [itemToDelete, setItemToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch all registers
  useEffect(() => {
    fetch("http://localhost:8080/allregister")
      .then((res) => res.json())
      .then(setRegisters)
      .catch(console.error);
  }, []);

  // Fetch items when register is selected
  useEffect(() => {
    if (!selectedRegister) {
      setItems([]);
      return;
    }
    
    setLoading(prev => ({...prev, items: true}));
    fetch(`http://localhost:8080/reg/item/${selectedRegister}`)
      .then((res) => res.json())
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(prev => ({...prev, items: false})));
  }, [selectedRegister]);

  const refreshItems = () => {
    if (selectedRegister) {
      fetch(`http://localhost:8080/reg/item/${selectedRegister}`)
        .then((res) => res.json())
        .then(setItems);
    }
  };

  const toggleItemDetails = async (itemId) => {
    if (expandedItemId === itemId) {
      setExpandedItemId(null);
      setSelectedItem(null);
      return;
    }
    
    setExpandedItemId(itemId);
    setLoading(prev => ({...prev, details: true}));

    try {
      const response = await fetch(`http://localhost:8080/itemdetailbyitemid/${itemId}`);
      const data = await response.json();
      setSelectedItem(data);
    } catch (err) {
      console.error("Error loading item details:", err);
      setSelectedItem(null);
    } finally {
      setLoading(prev => ({...prev, details: false}));
    }
  };

  const handleFormSubmit = async (type) => {
    if (!selectedRegister && type === 'add') {
      showSnackbar("Please select a register first", "error");
      return;
    }

    const url = type === 'add' 
      ? "http://localhost:8080/item" 
      : `http://localhost:8080/item/${formData.edit.id}`;
      
    const method = type === 'add' ? "POST" : "PUT";
    const body = type === 'add' 
      ? {...formData.add, registerid: selectedRegister}
      : formData.edit;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      showSnackbar(`Item ${type === 'add' ? 'added' : 'updated'} successfully!`);
      setDialog(prev => ({...prev, [type]: false}));
      refreshItems();
    } catch (err) {
      console.error(`Error ${type === 'add' ? 'adding' : 'updating'} item:`, err);
      showSnackbar(`Failed to ${type === 'add' ? 'add' : 'update'} item`, "error");
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8080/item/${itemToDelete}`, {
        method: "DELETE",
      });
      showSnackbar("Item deleted successfully!");
      setDialog(prev => ({...prev, delete: false}));
      refreshItems();
    } catch (err) {
      console.error("Error deleting item:", err);
      showSnackbar("Failed to delete item", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const filteredItems = useMemo(() => 
    items.filter(item => 
      item.itemname.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [items, searchQuery]
  );

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return filteredItems;
    
    return [...filteredItems].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredItems, sortConfig]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Register selection and search */}
      <Grid container spacing={2} alignItems="center">
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
              {registers.map((reg) => (
                <MenuItem key={reg.id} value={reg.id}>
                  {reg.rname}
                </MenuItem>
              ))}
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
        
        <Grid item xs={12} md={4} textAlign="right">
          <IconButton
            onClick={() => {
              setSelectedRegister("");
              setSearchQuery("");
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* Items table */}
      {selectedRegister && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-blue-600">
              <TableRow>
                {['id', 'itemname', 'pageno'].map((key) => (
                  <TableCell 
                    key={key}
                    className="text-white font-bold cursor-pointer"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center">
                      {key === 'id' ? 'Item ID' : 
                       key === 'itemname' ? 'Item Name' : 'Register PageNo.'}
                      {sortConfig.key === key && (
                        sortConfig.direction === "asc" 
                          ? <ArrowUpwardIcon fontSize="small" /> 
                          : <ArrowDownwardIcon fontSize="small" />
                      )}
                    </div>
                  </TableCell>
                ))}
                <TableCell className="text-white font-bold text-center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {loading.items ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : sortedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No Items Found
                  </TableCell>
                </TableRow>
              ) : (
                sortedItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow hover>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.itemname}</TableCell>
                      <TableCell>{item.pageno}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="contained"
                            color={expandedItemId === item.id ? "error" : "primary"}
                            endIcon={<ExpandMoreIcon />}
                            onClick={() => toggleItemDetails(item.id)}
                          >
                            {expandedItemId === item.id ? "Hide" : "View"}
                          </Button>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                edit: {
                                  id: item.id,
                                  itemname: item.itemname,
                                  pageno: item.pageno,
                                  itemquantity: item.itemquantity || "",
                                  rateperunit: item.rateperunit || "",
                                  itempurchasedate: item.itempurchasedate?.split('T')[0] || 
                                    new Date().toISOString().split('T')[0],
                                }
                              });
                              setDialog({...dialog, edit: true});
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setItemToDelete(item.id);
                              setDialog({...dialog, delete: true});
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Item details */}
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <Collapse in={expandedItemId === item.id}>
                          <div className="p-4 bg-gray-50">
                            {loading.details ? (
                              <div className="text-center">
                                <CircularProgress />
                              </div>
                            ) : selectedItem ? (
                              <>
                                <Typography variant="h6" className="mb-2">
                                  Item Details
                                </Typography>
                                <Grid container spacing={2}>
                                  {[
                                    ['Quantity', selectedItem.itemquantity],
                                    ['Issued', selectedItem.issuedquantity],
                                    ['Purchase Date', selectedItem.itempurchasedate && 
                                      new Date(selectedItem.itempurchasedate).toLocaleString()],
                                    ['Rate per Unit', `₹${selectedItem.rateperunit}`]
                                  ].map(([label, value]) => (
                                    <Grid item xs={6} key={label}>
                                      <Typography>
                                        <span className="font-semibold">{label}:</span> {value || '-'}
                                      </Typography>
                                    </Grid>
                                  ))}
                                </Grid>

                                {/* Issued details */}
                                {selectedItem.itemissue?.length > 0 ? (
                                  <TableContainer component={Paper} className="mt-4">
                                    <Table>
                                      <TableHead className="bg-blue-800">
                                        <TableRow>
                                          {['ID', 'Issued To', 'Return From', 'Quantity', 'Issue Date', 'Return Date']
                                            .map(head => (
                                              <TableCell key={head} className="text-white">
                                                {head}
                                              </TableCell>
                                            ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {selectedItem.itemissue.map(issue => (
                                          <TableRow key={issue.id}>
                                            <TableCell>{issue.id}</TableCell>
                                            <TableCell>{issue.issuedto || '-'}</TableCell>
                                            <TableCell>{issue.returnfrom || '-'}</TableCell>
                                            <TableCell>{issue.issuequan}</TableCell>
                                            <TableCell>
                                              {issue.issuedate ? new Date(issue.issuedate).toLocaleString() : '-'}
                                            </TableCell>
                                            <TableCell>
                                              {issue.returndate ? new Date(issue.returndate).toLocaleString() : '-'}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                ) : (
                                  <Typography className="text-center mt-4">
                                    No Issued Details Available
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
      <Dialog 
        open={dialog.add} 
        onClose={() => setDialog({...dialog, add: false})}
      >
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="mt-2">
            {[
              {id: 'itemname', label: 'Item Name', type: 'text'},
              {id: 'pageno', label: 'Page Number', type: 'number'},
              {id: 'itemquantity', label: 'Quantity', type: 'number'},
              {id: 'rateperunit', label: 'Rate per Unit', type: 'number'},
              {id: 'itempurchasedate', label: 'Purchase Date', type: 'date'}
            ].map(field => (
              <Grid item xs={12} key={field.id}>
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type}
                  value={formData.add[field.id]}
                  onChange={(e) => setFormData({
                    ...formData,
                    add: {...formData.add, [field.id]: e.target.value}
                  })}
                  InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDialog({...dialog, add: false})} 
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleFormSubmit('add')}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog 
        open={dialog.edit} 
        onClose={() => setDialog({...dialog, edit: false})}
      >
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="mt-2">
            {[
              {id: 'itemname', label: 'Item Name', disabled: true},
              {id: 'pageno', label: 'Page Number', disabled: true},
              {id: 'itemquantity', label: 'Quantity'},
              {id: 'rateperunit', label: 'Rate per Unit'},
              {id: 'itempurchasedate', label: 'Purchase Date', type: 'date'}
            ].map(field => (
              <Grid item xs={12} key={field.id}>
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type || 'text'}
                  value={formData.edit[field.id]}
                  disabled={field.disabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    edit: {...formData.edit, [field.id]: e.target.value}
                  })}
                  InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDialog({...dialog, edit: false})} 
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleFormSubmit('edit')}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={dialog.delete}
        onClose={() => setDialog({...dialog, delete: false})}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDialog({...dialog, delete: false})}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({...snackbar, open: false})}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ItemDetails;