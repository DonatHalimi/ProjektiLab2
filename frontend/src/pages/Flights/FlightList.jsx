import React, { useEffect, useState } from 'react';
import { getFlights, deleteFlight } from '../../utils/axiosInstance';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await getFlights();
        setFlights(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchFlights();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteFlight(id);
      setFlights(flights.filter(flight => flight.id !== id));
    } catch (error) {
      console.error('Error deleting flight:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-flight/${id}`);
    console.log('Edit flight with id:', id);
  };

  const handleCreate = () => {
    navigate('/create-flight');
  };

  return (
    <><Navbar />
    <Container>
      <Typography variant="h4" gutterBottom>
        Flights
      </Typography>

      <Button variant="contained" color="primary" onClick={handleCreate} style={{ marginBottom: '20px' }}>
          Create Flight
      </Button>

      <TableContainer component={Paper} style={{ width: '100%', margin: '20px' }}>
        <Table style={{ width: '100%' }}>
          <TableHead style={{ backgroundColor: '#f2f2f2' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Departure City</TableCell>
              <TableCell>Arrival City</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Reserved Seats</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight) => (
              <TableRow key={flight.id}>
                <TableCell>{flight.name}</TableCell>
                <TableCell>{flight.departureCity}</TableCell>
                <TableCell>{flight.arrivalCity}</TableCell>
                <TableCell>{flight.startDate}</TableCell>
                <TableCell>{flight.endDate}</TableCell>
                <TableCell>{flight.price}</TableCell>
                <TableCell>{flight.capacity}</TableCell>
                <TableCell>{flight.reservedSeats}</TableCell>
                <TableCell>
                  <Button variant="contained" style={{ backgroundColor: 'orange' }} onClick={() => handleEdit(flight.id)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(flight.id)} style={{ margin: '10px', backgroundColor: 'red' }}>
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

export default FlightList;