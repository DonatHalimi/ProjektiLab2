import { Alert, Box, Button, Container, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { getUsers } from '../../services/userService';
import { getFlightPurchase, getFlights, updateFlightPurchase } from '../../services/flightService';

const EditFlightPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flightPurchase, setFlightPurchase] = useState({
    Id: '',
    userId: '',
    flightId: '',
    seatsReserved: '',
    totalPrice: '',
  });
  const [users, setUsers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await getUsers();
        const flightsResponse = await getFlights();
        const flightPurchaseResponse = await getFlightPurchase(id);
        setUsers(usersResponse.data);
        setFlights(flightsResponse);
        setFlightPurchase({
          Id: flightPurchaseResponse.id,
          userId: flightPurchaseResponse.userId,
          flightId: flightPurchaseResponse.flightId,
          seatsReserved: flightPurchaseResponse.seatsReserved,
          totalPrice: flightPurchaseResponse.totalPrice,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFlightPurchase({ ...flightPurchase, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateFlightPurchase(id, flightPurchase);
    setOpen(true);
    setTimeout(() => {
      navigate('/flight-purchases');
    }, 2000);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom>
          Edit Flight Purchase
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
          <TextField label="Seats Reserved" type="number" name="seatsReserved" value={flightPurchase.seatsReserved} onChange={handleChange} />
          <TextField label="Total Price" type="number" name="totalPrice" value={flightPurchase.totalPrice} onChange={handleChange} disabled />
          <Button type="submit" variant="contained" color="primary">
            Update Flight Purchase
          </Button>
        </Box>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Flight purchase updated successfully!
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
};

export default EditFlightPurchase;