import React, { useEffect, useState } from 'react';
import { getHotels, deleteHotel } from '../../utils/axiosInstance';  
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getHotels();
        setHotels(response.data.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchHotels();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-hotel/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHotel(id); 
      setHotels(hotels.filter(hotel => hotel.hotelID !== id));
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  const handleCreate = () => {
    navigate('/create-hotel'); 
  };
  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom>
          Hotel List
        </Typography>
            {/* Create Button */}
            <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          style={{ marginBottom: '20px' }} 
        >
          Create New Hotel
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hotel ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Amenities</TableCell>
                <TableCell>Room Types</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {hotels.map((hotel) => (
    <TableRow key={hotel.hotelID}>
      <TableCell>{hotel.hotelID}</TableCell> {/* Hotel ID */}
      <TableCell>
        {hotel.image ? (
          <img
            src={`data:image/jpeg;base64,${hotel.image}`}
            alt="Hotel"
            className="hotel-image"
            style={{
              width: 50, 
              height: 50,
              objectFit: 'cover',
              borderRadius: '5px',
            }}
          />
        ) : (
          <Typography variant="body2" color="textSecondary">
            No Image
          </Typography>
        )}
      </TableCell>
      <TableCell>{hotel.name}</TableCell> {/* Hotel Name */}
      <TableCell>{hotel.location}</TableCell> {/* Location */}
      <TableCell>{hotel.capacity}</TableCell> {/* Capacity */}
      <TableCell>{(hotel.amenities || []).join(', ')}</TableCell> {/* Amenities */}
      <TableCell>{(hotel.roomTypes || []).join(', ')}</TableCell> {/* Room Types */}
      <TableCell>{new Date(hotel.createdAt).toLocaleString()}</TableCell> {/* Created At */}
      <TableCell>{new Date(hotel.updatedAt).toLocaleString()}</TableCell> {/* Updated At */}
      <TableCell>
        <Button onClick={() => handleEdit(hotel.hotelID)} variant="outlined">Edit</Button>
        <Button onClick={() => handleDelete(hotel.hotelID)} variant="outlined" color="error" style={{ marginLeft: 10 }}>
          Delete
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Footer />
    </>
  );
};

export default HotelList;
