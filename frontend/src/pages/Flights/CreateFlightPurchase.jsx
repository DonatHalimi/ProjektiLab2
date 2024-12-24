import React, { useState, useEffect } from 'react';
import { createFlightPurchase, getUsers, getFlights } from '../../utils/axiosInstance';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const CreateFlightPurchase = () => {
  const [flightPurchase, setFlightPurchase] = useState({
    userId: '',
    flightId: '',
    seatsReserved: '',
  });
  const [users, setUsers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndFlights = async () => {
      try {
        const usersResponse = await getUsers();
        console.log('Users API Response:', usersResponse.data); // Log the API response for users
        const flightsResponse = await getFlights();
        console.log('Flights API Response:', flightsResponse.data); // Log the API response for flights
        setUsers(Array.isArray(usersResponse.data.data) ? usersResponse.data.data : []);
        setFlights(Array.isArray(flightsResponse.data) ? flightsResponse.data : []);
      } catch (error) {
        console.error('Error fetching users or flights:', error);
      }
    };

    fetchUsersAndFlights();
  }, []);

  const handleChange = (e) => {
    setFlightPurchase({ ...flightPurchase, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (flightPurchase.seatsReserved < 1 || flightPurchase.seatsReserved > 8) {
      setError('Please enter a valid number of seats (1-8).');
      return;
    }
    try {
      await createFlightPurchase(flightPurchase);
      setOpen(true);
    } catch (error) {
      setError('Failed to create flight purchase.');
      console.error('Error creating flight purchase:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      navigate('/flight-purchases');
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
          Create Flight Purchase
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '20px' }}>
          <FormControl>
            <InputLabel>User</InputLabel>
            <Select name="userId" value={flightPurchase.userId} onChange={handleChange}>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Flight</InputLabel>
            <Select name="flightId" value={flightPurchase.flightId} onChange={handleChange}>
              {flights.map((flight) => (
                <MenuItem key={flight.id} value={flight.id}>
                  {flight.name} - {flight.departureCity} to {flight.arrivalCity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Seats Reserved"
            type="number"
            name="seatsReserved"
            value={flightPurchase.seatsReserved}
            onChange={handleChange}
            inputProps={{ min: 1, max: 8 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Create Flight Purchase
          </Button>
        </Box>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Flight purchase created successfully!
          </Alert>
        </Snackbar>
        {error && (
          <Snackbar open={true} autoHideDuration={6000} onClose={() => setError('')}>
            <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default CreateFlightPurchase;