import React, { useState, useEffect } from 'react';
import { getTours, createTourPurchase, getMyInfo } from '../../utils/axiosInstance';
import { Container, Typography, Card, CardContent, CardActions, Button, TextField, Snackbar, Alert, Grid, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, MenuItem, FormControl, Select, TablePagination } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const UserTourPurchase = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [reservedTickets, setReservedTickets] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyInfo();
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getTours();
        setTours(response.data);
        setFilteredTours(response.data); // Initialize filtered tours with all tours
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    // Apply filters on tours when filters change
    const applyFilters = () => {
      let filtered = tours;

      // Filter by name (search query)
      if (searchQuery) {
        filtered = filtered.filter((tour) =>
          tour.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by city
      if (cityFilter) {
        filtered = filtered.filter((tour) =>
          tour.city.toLowerCase() === cityFilter.toLowerCase()
        );
      }

      // Filter by price
      if (priceFilter) {
        filtered = filtered.filter((tour) => {
          const price = tour.price;
          if (priceFilter === 'low') return price < 100;
          if (priceFilter === 'medium') return price >= 100 && price <= 500;
          if (priceFilter === 'high') return price > 500;
          return true;
        });
      }

      setFilteredTours(filtered);
    };

    applyFilters();
  }, [searchQuery, cityFilter, priceFilter, tours]);

  const handleReserve = async () => {
    if (!reservedTickets || reservedTickets <= 0 || reservedTickets > 8) {
      setError('Please enter a valid number of ticket (1-8).');
      return;
    }
    const tourPurchase = {
      userId: profile.id,
      tourId: selectedTour,
      reservedTickets: parseInt(reservedTickets, 10),
    };
    try {
      await createTourPurchase(tourPurchase);
      setOpen(true);
      setReservedTickets('');
      setSelectedTour(null);
      setDialogOpen(false);
    } catch (error) {
      setError('Failed to reserve tickets.');
      console.error('Error reserving tickets:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleDialogOpen = (tourId) => {
    setSelectedTour(tourId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTour(null);
    setReservedTickets('');
  };

  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Tours
        </Typography>

        {/* Search and Filters */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by City</InputLabel>
              <Select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <MenuItem value="">All Cities</MenuItem>
                {Array.from(new Set(tours.map((tour) => tour.city))).map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Price</InputLabel>
              <Select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <MenuItem value="">All Prices</MenuItem>
                <MenuItem value="low">Below $100</MenuItem>
                <MenuItem value="medium">$100 - $500</MenuItem>
                <MenuItem value="high">Above $500</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {filteredTours
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((tour) => (
              <Grid item xs={12} sm={6} md={4} key={tour.id} margin={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="div">
                      {tour.name}
                    </Typography>
                    <Typography color="textSecondary">{tour.city}</Typography>
                    <Typography color="textSecondary">
                      Start Date: {new Date(tour.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography color="textSecondary">
                      End Date: {new Date(tour.endDate).toLocaleDateString()}
                    </Typography>
                    <Typography color="textSecondary">
                      Price: ${tour.price}
                    </Typography>
                    <Typography color="textSecondary">
                      Capacity: {tour.capacity}
                    </Typography>
                    <Typography color="textSecondary">
                      Reserved Tickets: {tour.reservedTickets}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="contained" color="primary" onClick={() => handleDialogOpen(tour.id)}>
                      Reserve
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={filteredTours.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Reserve Ticket Dialog */}
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Reserve Ticket</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Reserve ticket for Tour ID: {selectedTour} (1-8 tickets).
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Ticket Reserved"
              type="number"
              fullWidth
              value={reservedTickets}
              onChange={(e) => setReservedTickets(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleReserve} color="primary">
              Reserve
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Tickets reserved successfully!
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        {error && (
          <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default UserTourPurchase;
