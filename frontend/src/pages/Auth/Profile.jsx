import React, { useEffect, useState } from 'react';
import { getMyInfo, getMyFlightPurchases, deleteFlightPurchase } from '../../utils/axiosInstance';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Card, CardContent, Grid, Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const [profile, setProfile] = useState({});
  const [flightPurchases, setFlightPurchases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyInfo();
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching info:', error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile?.id) return; 

    const fetchFlightPurchases = async () => {
      try {
        const response = await getMyFlightPurchases(profile.id);
        console.log('API Response:', response.data);
        const MyflightPurchasesData = response.data || [];
        console.log('Flight Purchases Data:', MyflightPurchasesData);
        setFlightPurchases(MyflightPurchasesData);
      } catch (error) {
        console.error('Error fetching flight purchases:', error);
      }
    };

    fetchFlightPurchases();
  }, [profile]);


  const handleDelete = async (id) => {
    try {
      await deleteFlightPurchase(id);
      setFlightPurchases(flightPurchases.filter((purchase) => purchase.id !== id));
    } catch (error) {
      console.error('Error deleting flight purchase:', error);
    }
  };

  const handleCheckout = (id) => {
    navigate(`/checkout/${id}`);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            My Profile
          </Typography>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Name</Typography>
                  <Typography variant="body1">{profile.firstName + ' ' + profile.lastName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Email</Typography>
                  <Typography variant="body1">{profile.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Role</Typography>
                  <Typography variant="body1">{profile.role}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        <Typography variant="h4" gutterBottom>
          My Flights Purchase List
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
              <TableRow>
                <TableCell>User Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Flight Name</TableCell>
                <TableCell>Seats Reserved</TableCell>
                <TableCell>Departure City</TableCell>
                <TableCell>Arrival City</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Price</TableCell>
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
                  <TableCell>{purchase.totalPrice}</TableCell>
                  <TableCell>
                    <Button variant="contained" style={{ backgroundColor: 'red' }} onClick={() => handleDelete(purchase.id)} sx={{ mt: 1 }}>
                      Delete
                    </Button>
                    <Button variant="contained" color="success" onClick={() => handleCheckout(purchase.id)} sx={{ mt: 1 }}>
                      Checkout
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

export default MyProfile;