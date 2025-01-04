import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { deleteTour, getTours } from '../../utils/axiosInstance';

const TourList = () => {
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getTours();
        setTours(response.data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };
    fetchTours();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTour(id);
      setTours(tours.filter((tour) => tour.id !== id));
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-tour/${id}`);
  };

  const handleCreate = () => {
    navigate('/create-tour');
  };

  return (
    <>
      <Navbar />
      <div className='container mx-auto'>
        <Typography variant="h4" gutterBottom>
          Tours
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          style={{ marginBottom: '20px' }}
        >
          Create Tour
        </Button>
        <TableContainer component={Paper} style={{ width: '100%', margin: '20px' }}>
          <Table style={{ width: '100%' }}>
            <TableHead style={{ backgroundColor: '#f2f2f2' }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Reserved Tickets</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell>{tour.name}</TableCell>
                  <TableCell>{tour.city}</TableCell>
                  <TableCell>{new Date(tour.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(tour.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{tour.price}</TableCell>
                  <TableCell>{tour.capacity}</TableCell>
                  <TableCell>{tour.reservedTickets}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: 'orange' }}
                      onClick={() => handleEdit(tour.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(tour.id)}
                      style={{ margin: '10px', backgroundColor: 'red' }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Footer />
    </>
  );
};

export default TourList;
