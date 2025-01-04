import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { getTour, updateTour } from '../../utils/axiosInstance';

const EditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState({
    id: '',
    name: '',
    city: '',
    startDate: '',
    endDate: '',
    price: '',
    capacity: '',
    reservedTickets: '',
  });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const tourResponse = await getTour(id);
        setTour({
          id: id,
          name: tourResponse.data.name,
          city: tourResponse.data.city,
          startDate: tourResponse.data.startDate,
          endDate: tourResponse.data.endDate,
          price: tourResponse.data.price,
          capacity: tourResponse.data.capacity,
          reservedTickets: tourResponse.data.reservedTickets,
        });
      } catch (error) {
        setError('Error fetching tour data');
        console.error('Error fetching tour data:', error);
      }
    };
    fetchTourData();
  }, [id]);

  const handleChange = (e) => {
    setTour({ ...tour, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(tour.startDate) > new Date(tour.endDate)) {
      setError('Start date cannot be later than the end date.');
      return;
    }
    try {
      await updateTour(id, tour);
      setOpen(true);
      setTimeout(() => {
        navigate('/tour-list');
      }, 1000);
    } catch (error) {
      setError('Failed to update tour');
      console.error('Error updating tour:', error);
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
          Edit Tour
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '20px' }}
        >
          <TextField
            label="Name"
            name="name"
            value={tour.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="City"
            name="city"
            value={tour.city}
            onChange={handleChange}
            required
          />
          <TextField
            label="Start Date"
            type="datetime-local"
            name="startDate"
            value={tour.startDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="End Date"
            type="datetime-local"
            name="endDate"
            value={tour.endDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Price"
            type="number"
            name="price"
            value={tour.price}
            onChange={handleChange}
            required
          />
          <TextField
            label="Capacity"
            type="number"
            name="capacity"
            value={tour.capacity}
            onChange={handleChange}
            required
          />
          <TextField
            label="Reserved Tickets"
            type="number"
            name="reservedTickets"
            value={tour.reservedTickets}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Update Tour
          </Button>
        </Box>
        <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Tour updated successfully!
          </Alert>
        </Snackbar>
        {error && (
          <Snackbar open={true} autoHideDuration={4000} onClose={() => setError('')}>
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

export default EditTour;
