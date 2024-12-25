import React, { useState } from 'react';
import { createTour } from '../../utils/axiosInstance'; 
import { Container, TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const CreateTour = () => {
  const [tour, setTour] = useState({
    name: '',
    city: '',
    startDate: '',
    endDate: '',
    price: '',
    capacity: '',
  });

  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTour({ ...tour, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!tour.name || !tour.city || !tour.startDate || !tour.endDate || !tour.price || !tour.capacity) {
      setError('All fields are required.');
      return;
    }

    if (new Date(tour.startDate) < new Date()) {
      setError('Start date must be in the future.');
      return;
    }

    if (new Date(tour.endDate) < new Date(tour.startDate)) {
      setError('End date must be after the start date.');
      return;
    }

    try {
      await createTour(tour);
      setOpen(true);
    } catch (error) {
      setError('Failed to create tour. Please check the input values and try again.');
      console.error('Error creating tour:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      navigate('/tour-list'); 
    }, 100);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
          Create Tour
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '20px' }}>
          <TextField label="Name" name="name" onChange={handleChange} />
          <TextField label="City" name="city" onChange={handleChange} />
          <TextField label="Start Date" type="datetime-local" name="startDate" InputLabelProps={{ shrink: true }} onChange={handleChange} />
          <TextField label="End Date" type="datetime-local" name="endDate" InputLabelProps={{ shrink: true }} onChange={handleChange} />
          <TextField label="Price" type="number" name="price" onChange={handleChange} />
          <TextField label="Capacity" type="number" name="capacity" onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary">
            Create Tour
          </Button>
        </Box>
        <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Tour created successfully!
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

export default CreateTour;
