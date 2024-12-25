import React, { useState, useEffect } from 'react';
import { createTourPurchase, getUsers, getTours } from '../../utils/axiosInstance'; // Updated API calls
import { Container, TextField, Button, Typography, Box, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const CreateTourPurchase = () => {
  const [tourPurchase, setTourPurchase] = useState({
    userId: '',
    tourId: '',
    reservedTickets: '',
  });
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndTours = async () => {
      try {
        const usersResponse = await getUsers();
        console.log('Users API Response:', usersResponse.data); // Log the API response for users
        const toursResponse = await getTours();
        console.log('Tours API Response:', toursResponse.data); // Log the API response for tours
        setUsers(Array.isArray(usersResponse.data.data) ? usersResponse.data.data : []);
        setTours(Array.isArray(toursResponse.data) ? toursResponse.data : []);
      } catch (error) {
        console.error('Error fetching users or tours:', error);
      }
    };
    fetchUsersAndTours();
  }, []);

  const handleChange = (e) => {
    setTourPurchase({ ...tourPurchase, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tourPurchase.reservedTickets < 1 || tourPurchase.reservedTickets > 8) {
      setError('Please enter a valid number of tickets (1-8).');
      return;
    }
    try {
      await createTourPurchase(tourPurchase); 
      setOpen(true);
    } catch (error) {
      setError('Failed to create tour purchase.');
      console.error('Error creating tour purchase:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      navigate('/tour-purchases'); 
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
          Create Tour Purchase
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '20px' }}>
          <FormControl>
            <InputLabel>User</InputLabel>
            <Select name="userId" value={tourPurchase.userId} onChange={handleChange}>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Tour</InputLabel>
            <Select name="tourId" value={tourPurchase.tourId} onChange={handleChange}>
              {tours.map((tour) => (
                <MenuItem key={tour.id} value={tour.id}>
                  {tour.name} - {tour.city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Reserved Tickets"
            type="number"
            name="reservedTickets"
            value={tourPurchase.reservedTickets}
            onChange={handleChange}
            inputProps={{ min: 1, max: 8 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Create Tour Purchase
          </Button>
        </Box>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Tour purchase created successfully!
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

export default CreateTourPurchase;
