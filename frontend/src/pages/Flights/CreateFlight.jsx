import React, { useState } from 'react';
import { createFlight } from '../../utils/axiosInstance';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const CreateFlight = () => {
  const [flight, setFlight] = useState({
    name: '',
    departureCity: '',
    arrivalCity: '',
    startDate: '',
    endDate: '',
    price: '',
    capacity: '',
  });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFlight({ ...flight, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFlight(flight);
      setOpen(true);
    } catch (error) {
      setError('Failed to create flight. Please check the input values and try again.');
      console.error('Error creating flight:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      navigate('/flights');
    }, 100);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
          Create Flight
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '20px' }}>
          <TextField label="Name" name="name" onChange={handleChange} />
          <TextField label="Departure City" name="departureCity" onChange={handleChange} />
          <TextField label="Arrival City" name="arrivalCity" onChange={handleChange} />
          <TextField label="Start Date" type="datetime-local" name="startDate" InputLabelProps={{ shrink: true }} onChange={handleChange} />
          <TextField label="End Date" type="datetime-local" name="endDate" InputLabelProps={{ shrink: true }} onChange={handleChange} />
          <TextField label="Price" type="number" name="price" onChange={handleChange} />
          <TextField label="Capacity" type="number" name="capacity" onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary">
            Create Flight
          </Button>
        </Box>
        <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Flight created successfully!
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

export default CreateFlight;