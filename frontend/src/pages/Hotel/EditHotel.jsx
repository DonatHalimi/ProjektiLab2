import React, { useState, useEffect } from 'react';
import { getHotel, updateHotel } from '../../utils/axiosInstance'; 
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState({
    hotelID: '',
    name: '',
    location: '',
    capacity: '',
    amenities: '',
    roomTypes: '',
    image: null, 
    currentImage: null, 
  });

  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelResponse = await getHotel(id);
        
        setHotel({
          hotelID: id || '',
          name: hotelResponse.data.data.name || '',
          location: hotelResponse.data.data.location || '',
          capacity: hotelResponse.data.data.capacity || '',
          amenities: Array.isArray(hotelResponse.data.data.amenities)
            ? hotelResponse.data.data.amenities.join(', ')
            : hotelResponse.data.data.amenities || '',
          roomTypes: Array.isArray(hotelResponse.data.data.roomTypes)
            ? hotelResponse.data.data.roomTypes.join(', ')
            : hotelResponse.data.data.roomTypes || '',
          image: null,
            currentImage: hotelResponse.data.data.image || null,
        });
      } catch (error) {
        console.error('Error fetching hotel data:', error);
        setError('Error fetching hotel data');
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
        setHotel({ ...hotel, image: e.target.files[0] });
      } else {
    setHotel({ ...hotel, [e.target.name]: e.target.value });
      }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData();
        formData.append('HotelID', hotel.hotelID);
        formData.append('name', hotel.name);
        formData.append('Capacity', hotel.capacity); 
        formData.append('Location', hotel.location);
        formData.append('Amenities', hotel.amenities);
        formData.append('RoomTypes', hotel.roomTypes);
      console.log("this", hotel.currentImage);
        if(hotel.image){
          formData.append('Image', hotel.image);
        }
        else{
          const current = base64ToFile(hotel.currentImage);
          console.log("current", current);
          formData.append('Image', current);
        }

    await updateHotel(id, formData);
      setOpen(true);
      setTimeout(() => {
        navigate('/hotels');
      }, 1000);
    } catch (error) {
      setError('Failed to update hotel');
      console.error('Error updating hotel:', error);
    }
  };

  function base64ToFile(base64String) {
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
  
    const binaryString = atob(base64Data);
  
    const byteArray = new Uint8Array(binaryString.length);
  
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
  
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    const fileName = `image_${Date.now()}.jpg`;

    const file = new File([blob], fileName, { type: 'image/jpeg' });
  
    return file;
  }
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom>
          Edit Hotel
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '20px' }}
        >
          <TextField
            label="Name"
            name="name"
            value={hotel.name || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Location"
            name="location"
            value={hotel.location || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Capacity"
            name="capacity"
            value={hotel.capacity || ''}
            onChange={handleChange}
            type="number"
            fullWidth
          />
          <TextField
            label="Amenities (comma separated)"
            name="amenities"
            value={hotel.amenities || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Room Types (comma separated)"
            name="roomTypes"
            value={hotel.roomTypes || ''}
            onChange={handleChange}
            fullWidth
          />
            {hotel.currentImage && (
            <Box>
              <Typography>Current Image:</Typography>
              <img
                src={`data:image/jpeg;base64,${hotel.currentImage}`} 
                alt="Current Hotel"
                style={{ width: '200px', height: '150px', objectFit: 'cover' }}
              />
            </Box>
          )}
          <Typography>Upload New Image (Optional):</Typography>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
          <Button type="submit" variant="contained" color="primary">
            Update Hotel
          </Button>
        </Box>

        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Hotel updated successfully!
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

export default EditHotel;
