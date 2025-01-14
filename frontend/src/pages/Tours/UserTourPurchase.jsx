import { Alert, Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { getCurrentUser } from '../../services/authService';
import { createTourPurchase, getTours } from '../../services/tourService';

const UserTourPurchase = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [reservedTickets, setReservedTickets] = useState('');
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
        const response = await getCurrentUser();
        setProfile(response);
      } catch (error) {
        setProfile(null);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getTours();
        setTours(response);
        setFilteredTours(response);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    let filtered = tours;

    if (search) {
      filtered = filtered.filter(tour =>
        tour.name.toLowerCase().includes(search.toLowerCase()) ||
        tour.city.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter) {
      filtered = filtered.filter(tour => tour.city === filter);
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

    setFilteredTours(filtered);
  }, [search, filter, sort, tours]);

  const handleReserve = async () => {
    if (!reservedTickets || reservedTickets <= 0 || reservedTickets > 8) {
      setError('Please enter a valid number of tickets (1-8).');
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

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const uniqueCities = [...new Set(tours?.map(tour => tour.city))];

  const paginatedTours = filteredTours?.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Navbar />
      <div className='container mx-auto mt-10'>
        <Typography variant="h4" gutterBottom>
          Available Tours
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Filter by City</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {uniqueCities.map((city) => (
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
          {paginatedTours?.map((tour) => (
            <Grid item xs={12} sm={6} md={4} key={tour.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, backgroundColor: '#f5f5f5' }}>
                <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {tour.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {tour.city}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start Date: {new Date(tour.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    End Date: {new Date(tour.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price: {tour.price}$
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Capacity: {tour.capacity}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Reserved Tickets: {tour.reservedTickets}
                  </Typography>
                </CardContent>
                <CardActions sx={{ padding: 2, backgroundColor: '#e0e0e0', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary" onClick={() => handleDialogOpen(tour.id)}>
                    Reserve
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredTours?.length / pageSize)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ m: 2 }}
          />
        </Box>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Reserve Tickets</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Reserve tickets for Tour ID: {selectedTour} (1-8 tickets).
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Tickets Reserved"
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
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Tickets reserved successfully!
          </Alert>
        </Snackbar>
        {error && (
          <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserTourPurchase;