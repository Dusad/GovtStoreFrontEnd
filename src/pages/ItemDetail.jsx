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
} from "@mui/material";
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
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
                    <TableRow
                      className="cursor-pointer hover:bg-gray-100 transition-all"
                      onClick={() => toggleItemDetails(item.id)}
                    >
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.itemname}</TableCell>
                      <TableCell>{item.pageno}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="contained"
                          className={`${
                            expandedItemId === item.id
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                          endIcon={<ExpandMoreIcon />}
                        >
                          {expandedItemId === item.id ? "Hide Details" : "View Details"}
                        </Button>
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
    </div>
  );
};

export default ItemDetails;