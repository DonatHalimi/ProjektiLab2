import { Alert, Box, Button, Card, CardContent, Container, Grid, Snackbar, TextField, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { getCurrentUser } from '../../services/authService';
import { getTourPurchase } from '../../services/tourService';

const CheckoutTour = () => {
  const { id } = useParams();
  const [tourPurchase, setTourPurchase] = useState(null);
  const [profile, setProfile] = useState(null);
  const [passengerNames, setPassengerNames] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTourPurchase = async () => {
      try {
        const response = await getTourPurchase(id);
        setTourPurchase(response.data);
        setPassengerNames(Array(response.data.reservedTickets).fill(''));
      } catch (error) {
        console.error('Error fetching tour purchase:', error);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await getCurrentUser();
        setProfile(response);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchTourPurchase();
    fetchProfile();
  }, [id]);

  const handlePassengerNameChange = (index, value) => {
    const newPassengerNames = [...passengerNames];
    newPassengerNames[index] = value;
    setPassengerNames(newPassengerNames);
  };

  const handleDownloadReceipt = () => {
    if (passengerNames.some(name => name.trim() === '')) {
      setError('Please fill in all passenger names.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Tour Reservation Receipt', 60, 10);
    doc.setFontSize(17);
    doc.text(`Tour Info:`, 20, 30);
    doc.setFontSize(12);
    doc.text(`Tour: ${tourPurchase.tour.name}`, 20, 40);
    doc.text(`City: ${tourPurchase.tour.city}`, 20, 50);
    doc.text(`Start Date: ${new Date(tourPurchase.tour.startDate).toLocaleDateString()}`, 20, 70);
    doc.text(`End Date: ${new Date(tourPurchase.tour.endDate).toLocaleDateString()}`, 20, 80);
    doc.text(`ReservedTickets: ${tourPurchase.reservedTickets}`, 20, 90);
    doc.text(`Total Price: $${tourPurchase.totalPrice}`, 20, 100);

    doc.setFontSize(17);
    doc.text(`User Info:`, 140, 30);
    doc.setFontSize(12);
    doc.text(`User Name: ${profile.firstName} ${profile.lastName}`, 140, 40);
    doc.text(`User Email: ${profile.email}`, 140, 50);

    doc.setFontSize(17);
    doc.text(`Passenger Names:`, 20, 120);
    doc.setFontSize(12);
    passengerNames.forEach((name, index) => {
      doc.text(`Ticket ${index + 1}: ${name}`, 20, 130 + index * 10);
    });

    doc.setFontSize(12);
    doc.text('Company Signature:', 20, 250);
    doc.setFont('courier-oblique');
    doc.text('Travel Agency', 35, 260);
    doc.setFont('helvetica');
    doc.text('_________________________', 20, 260);
    doc.text('Your Signature:', 140, 250);
    doc.text('_________________________', 140, 260);
    doc.text('Company Address: 123 Street, Prishtina, Kosovo', 60, 280);
    doc.save('receipt.pdf');
  };

  const handleClose = () => {
    setError('');
  };

  if (!tourPurchase || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Tour: {tourPurchase.tour.name}
            </Typography>
            <Typography color="textSecondary">
              City: {tourPurchase.tour.city}
            </Typography>
            <Typography color="textSecondary">
              Start Date: {new Date(tourPurchase.tour.startDate).toLocaleDateString()}
            </Typography>
            <Typography color="textSecondary">
              End Date: {new Date(tourPurchase.tour.endDate).toLocaleDateString()}
            </Typography>
            <Typography color="textSecondary">
              Tickets Reserved: {tourPurchase.reservedTickets}
            </Typography>
            <Typography color="textSecondary">
              Total Price: ${tourPurchase.totalPrice}
            </Typography>
            <Typography color="textSecondary">
              User Name: {profile.firstName} {profile.lastName}
            </Typography>
            <Typography color="textSecondary">
              User Email: {profile.email}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Passenger Names</Typography>
              <Grid container spacing={2}>
                {passengerNames.map((name, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      label={`Ticket ${index + 1}`}
                      value={name}
                      onChange={(e) => handlePassengerNameChange(index, e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>

                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ m: 4 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Proceed to Payment
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDownloadReceipt}>
            Download Receipt
          </Button>
        </Box>
        {error && (
          <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default CheckoutTour;
