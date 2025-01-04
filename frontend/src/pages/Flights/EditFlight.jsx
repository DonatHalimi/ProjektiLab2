import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { getFlight, updateFlight } from '../../utils/axiosInstance';

const EditFlight = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState({
    Id: '',
    name: '',
    departureCity: '',
    arrivalCity: '',
    startDate: '',
    endDate: '',
    price: '',
    capacity: '',
    reservedSeats: '',
  });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flightResponse = await getFlight(id);
        setFlight({
          Id: id,
          name: flightResponse.data.name,
          departureCity: flightResponse.data.departureCity,
          arrivalCity: flightResponse.data.arrivalCity,
          startDate: flightResponse.data.startDate,
          endDate: flightResponse.data.endDate,
          price: flightResponse.data.price,
          capacity: flightResponse.data.capacity,
          reservedSeats: flightResponse.data.reservedSeats,
        });
      } catch (error) {
        setError('Error fetching flight data');
        console.error('Error fetching flight data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFlight({ ...flight, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFlight(id, flight);
      setOpen(true);
      setTimeout(() => {
        navigate('/flights');
      }, 100);
    } catch (error) {
      setError('Failed to update flight');
      console.error('Error updating flight:', error);
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
          Edit Flight
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '20px' }}>
          <TextField label="Name" name="name" value={flight.name} onChange={handleChange} />
          <TextField label="Departure City" name="departureCity" value={flight.departureCity} onChange={handleChange} />
          <TextField label="Arrival City" name="arrivalCity" value={flight.arrivalCity} onChange={handleChange} />
          <TextField label="Start Date" type="datetime-local" name="startDate" value={flight.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField label="End Date" type="datetime-local" name="endDate" value={flight.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField label="Price" type="number" name="price" value={flight.price} onChange={handleChange} />
          <TextField label="Capacity" type="number" name="capacity" value={flight.capacity} onChange={handleChange} />
          <TextField label="Reserved Seats" type="number" name="reservedSeats" value={flight.reservedSeats} onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary">
            Update Flight
          </Button>
        </Box>
        <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Flight updated successfully!
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

export default EditFlight;