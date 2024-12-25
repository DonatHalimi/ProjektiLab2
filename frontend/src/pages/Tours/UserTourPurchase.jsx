import React, { useState, useEffect } from 'react';
import { getTours, createTourPurchase, getMyInfo } from '../../utils/axiosInstance';
import { Container, Typography, Card, CardContent, CardActions, Button, TextField, Snackbar, Alert, Grid, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const UserTourPurchase = () => {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [reservedTickets, setReservedTickets] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);

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
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };
    fetchTours();
  }, []);

  const handleReserve = async () => {
    if (!reservedTickets || reservedTickets <= 0 || reservedTickets> 8) {
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

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Tours
        </Typography>
        <Grid container spacing={3}>
          {tours.map((tour) => (
            <Grid item xs={12} sm={6} md={4} key={tour.id} margin={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div">
                    {tour.name}
                  </Typography>
                  <Typography color="textSecondary">
                    {tour.departureCity} to {tour.arrivalCity}
                  </Typography>
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
                    Reserved Ticket: {tour.reservedTickets}
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
      </Container>
      <Footer />
    </>
  );
};

export default UserTourPurchase;
