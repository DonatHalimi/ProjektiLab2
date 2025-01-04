import React, { useEffect, useState } from 'react';
import { deleteFlightPurchase, getFlightPurchases } from '../../utils/axiosInstance';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const FlightPurchaseList = () => {
  const [flightPurchases, setFlightPurchases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlightPurchases = async () => {
      try {
        const response = await getFlightPurchases();
        const flightPurchasesData = response.data || [];
        setFlightPurchases(flightPurchasesData);
      } catch (error) {
        console.error('Error fetching flight purchases:', error);
      }
    };

    fetchFlightPurchases();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteFlightPurchase(id);
      setFlightPurchases(flightPurchases.filter(flightPurchases => flightPurchases.id !== id));
    } catch (error) {
      console.error('Error deleting flight:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-flight-purchase/${id}`);
  };

  const handleCreate = () => {
    navigate('/create-flight-purchase');
  };

  return (
    <><Navbar />
      <Container>
        <Typography variant="h4" gutterBottom>
          Flights Purchase List
        </Typography>
        <Button variant="contained" color="primary" onClick={handleCreate} style={{ marginBottom: '20px' }}>
          Create Flight Purchase
        </Button>
        <TableContainer component={Paper} style={{ width: '100%', margin: '20px' }}>
          <Table>
            <TableHead style={{ backgroundColor: '#f2f2f2' }}>
              <TableRow>
                <TableCell>User Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Flight Name </TableCell>
                <TableCell>Seats Reserved </TableCell>
                <TableCell>Deperature City</TableCell>
                <TableCell>Arrival City</TableCell>
                <TableCell>Start Date </TableCell>
                <TableCell>End Date </TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flightPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.user.id}</TableCell>
                  <TableCell>{purchase.user.firstName}</TableCell>
                  <TableCell>{purchase.user.email}</TableCell>
                  <TableCell>{purchase.flight.name}</TableCell>
                  <TableCell>{purchase.seatsReserved}</TableCell>
                  <TableCell>{purchase.flight.departureCity}</TableCell>
                  <TableCell>{purchase.flight.arrivalCity}</TableCell>
                  <TableCell>{purchase.flight.startDate}</TableCell>
                  <TableCell>{purchase.flight.endDate}</TableCell>
                  <TableCell>{purchase.totalPrice} </TableCell>
                  <TableCell>
                    <Button variant="contained" style={{ margin: '10px', backgroundColor: 'orange' }} onClick={() => handleEdit(purchase.id)}>
                      Edit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(purchase.id)} style={{ marginTop: '10px', backgroundColor: 'red' }}>
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

export default FlightPurchaseList;