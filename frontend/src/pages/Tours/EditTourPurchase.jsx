import React, { useState, useEffect } from 'react';
import { getTourPurchase, updateTourPurchase, getUsers, getTours } from '../../utils/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const EditTourPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tourPurchase, setTourPurchase] = useState({
    Id: '',
    userId: '',
    tourId: '',
    reservedTickets: '',
    totalPrice: '',
  });
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await getUsers();
        const toursResponse = await getTours();
        const tourPurchaseResponse = await getTourPurchase(id);
        
        setUsers(usersResponse.data.data || []);
        setTours(toursResponse.data || []);
        setTourPurchase({
          Id: tourPurchaseResponse.data.id,
          userId: tourPurchaseResponse.data.userId,
          tourId: tourPurchaseResponse.data.tourId,
          reservedTickets: tourPurchaseResponse.data.reservedTickets,
          totalPrice: tourPurchaseResponse.data.totalPrice,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setTourPurchase({ ...tourPurchase, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTourPurchase(id, tourPurchase);
      setOpen(true);
      setTimeout(() => {
        navigate('/tour-purchases');
      }, 2000);
    } catch (error) {
      console.error('Error updating tour purchase:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom>
          Edit Tour Purchase
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
          />

          <TextField
            label="Total Price"
            type="number"
            name="totalPrice"
            value={tourPurchase.totalPrice}
            onChange={handleChange}
            disabled
          />

          <Button type="submit" variant="contained" color="primary">
            Update Tour Purchase
          </Button>
        </Box>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Tour purchase updated successfully!
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
};

export default EditTourPurchase;
