import React, { useState } from 'react';
import { createHotel } from '../../utils/axiosInstance'; 
import { Container, TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const CreateHotel = () => {
  const [hotel, setHotel] = useState({
    name: '',
    location: '',
    capacity: '',
    amenities: '',
    roomTypes: '',
    image: null, 
  });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setHotel({ ...hotel, image: files[0] }); 
    } else {
      setHotel({ ...hotel, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    const formData = new FormData();
    formData.append('Name', hotel.name);
    formData.append('Location', hotel.location);
    formData.append('Capacity', hotel.capacity);
    formData.append('Amenities', hotel.amenities);
    formData.append('RoomTypes', hotel.roomTypes);
    formData.append('Image', hotel.image); 
    try {
      await createHotel(formData);
      setOpen(true);
    } catch (error) {
      setError('Failed to create hotel. Please check the input values and try again.');
      console.error('Error creating hotel:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      navigate('/hotels'); 
    }, 100);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
          Create Hotel
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '20px' }}>
          <TextField label="Name" name="name" onChange={handleChange} fullWidth />
          <TextField label="Location" name="location" onChange={handleChange} fullWidth />
          <TextField label="Capacity" type="number" name="capacity" onChange={handleChange} fullWidth />
          <TextField label="Amenities (comma separated)" name="amenities" onChange={handleChange} fullWidth />
          <TextField label="Room Types (comma separated)" name="roomTypes" onChange={handleChange} fullWidth />
          <input type="file" name="image" onChange={handleChange} accept="image/*" />

          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Create Hotel
          </Button>
        </Box>

        <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Hotel created successfully!
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

export default CreateHotel;
