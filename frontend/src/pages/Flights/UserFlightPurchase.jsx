import React, { useState, useEffect } from 'react';
import { getFlights, createFlightPurchase, getMyInfo } from '../../utils/axiosInstance';
import { Container, Typography, Card, CardContent, CardActions, Button, TextField, Snackbar, Alert, Grid, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, InputLabel, FormControl, Pagination } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const UserFlightPurchase = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [seatsReserved, setSeatsReserved] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);

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
    const fetchFlights = async () => {
      try {
        const response = await getFlights();
        setFlights(response.data);
        setFilteredFlights(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchFlights();
  }, []);

  useEffect(() => {
    let filtered = flights;

    if (search) {
      filtered = filtered.filter(flight =>
        flight.name.toLowerCase().includes(search.toLowerCase()) ||
        flight.departureCity.toLowerCase().includes(search.toLowerCase()) ||
        flight.arrivalCity.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter) {
      filtered = filtered.filter(flight => flight.departureCity === filter);
    }

    if (sort) {
      filtered = [...filtered].sort((a, b) => {
        if (sort === 'price') {
          return a.price - b.price;
        } else if (sort === 'startDate') {
          return new Date(a.startDate) - new Date(b.startDate);
        } else if (sort === 'endDate') {
          return new Date(a.endDate) - new Date(b.endDate);
        }
        return 0;
      });
    }

    setFilteredFlights(filtered);
  }, [search, filter, sort, flights]);

  const handleReserve = async () => {
    if (!seatsReserved || seatsReserved <= 0 || seatsReserved > 8) {
      setError('Please enter a valid number of seats (1-8).');
      return;
    }

    const flightPurchase = {
      userId: profile.id,
      flightId: selectedFlight,
      seatsReserved: parseInt(seatsReserved, 10),
    };

    try {
      await createFlightPurchase(flightPurchase);
      setOpen(true);
      setSeatsReserved('');
      setSelectedFlight(null);
      setDialogOpen(false);
    } catch (error) {
      setError('Failed to reserve seats.');
      console.error('Error reserving seats:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleDialogOpen = (flightId) => {
    setSelectedFlight(flightId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedFlight(null);
    setSeatsReserved('');
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const uniqueDepartureCities = [...new Set(flights.map(flight => flight.departureCity))];

  const paginatedFlights = filteredFlights.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Flights
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Filter by Departure City</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {uniqueDepartureCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="startDate">Start Date</MenuItem>
              <MenuItem value="endDate">End Date</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={3}>
          {paginatedFlights.map((flight) => (
            <Grid item xs={12} sm={6} md={4} key={flight.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, backgroundColor: '#f5f5f5' }}>
                <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {flight.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {flight.departureCity} to {flight.arrivalCity}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start Date: {new Date(flight.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    End Date: {new Date(flight.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price: {flight.price}$
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Capacity: {flight.capacity}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Reserved Seats: {flight.reservedSeats}
                  </Typography>
                </CardContent>
                <CardActions sx={{ padding: 2, backgroundColor: '#e0e0e0', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary" onClick={() => handleDialogOpen(flight.id)}>
                    Reserve
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredFlights.length / pageSize)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ m: 2 }}
          />
        </Box>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Reserve Seats</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Reserve seats for Flight ID: {selectedFlight} (1-8 seats).
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Seats Reserved"
              type="number"
              fullWidth
              value={seatsReserved}
              onChange={(e) => setSeatsReserved(e.target.value)}
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
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Seats reserved successfully!
          </Alert>
        </Snackbar>
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

export default UserFlightPurchase;