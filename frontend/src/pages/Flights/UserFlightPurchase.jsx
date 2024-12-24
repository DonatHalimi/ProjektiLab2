import React, { useState, useEffect } from 'react';
import { getFlights, createFlightPurchase, getMyInfo } from '../../utils/axiosInstance';
import { Container, Typography, Card, CardContent, CardActions, Button, TextField, Snackbar, Alert, Grid, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const UserFlightPurchase = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [seatsReserved, setSeatsReserved] = useState('');
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
    const fetchFlights = async () => {
      try {
        const response = await getFlights();
        setFlights(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchFlights();
  }, []);

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

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Flights
        </Typography>
        <Grid container spacing={3}>
          {flights.map((flight) => (
            <Grid item xs={12} sm={6} md={4} key={flight.id} margin={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div">
                    {flight.name}
                  </Typography>
                  <Typography color="textSecondary">
                    {flight.departureCity} to {flight.arrivalCity}
                  </Typography>
                  <Typography color="textSecondary">
                    Start Date: {new Date(flight.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography color="textSecondary">
                    End Date: {new Date(flight.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography color="textSecondary">
                    Price: ${flight.price}
                  </Typography>
                  <Typography color="textSecondary">
                    Capacity: {flight.capacity}
                  </Typography>
                  <Typography color="textSecondary">
                    Reserved Seats: {flight.reservedSeats}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" onClick={() => handleDialogOpen(flight.id)}>
                    Reserve
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
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