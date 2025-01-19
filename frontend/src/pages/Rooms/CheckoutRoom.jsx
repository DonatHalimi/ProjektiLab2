import { Alert, Box, Button, Card, CardContent, Container, Grid, Snackbar, TextField, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { getCurrentUser } from '../../services/authService';
import { getRoomPurchase } from '../../services/roomService';

const CheckoutRoom = () => {
  const { id } = useParams();
  const [roomPurchase, setRoomPurchase] = useState(null);
  const [guestNames, setGuestNames] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoomPurchase = async () => {
      try {
        const response = await getRoomPurchase(id);
        setRoomPurchase(response);
        setGuestNames(Array(response.guests).fill(''));
      } catch (error) {
        console.error('Error fetching room purchase:', error);
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

    fetchRoomPurchase();
    fetchProfile();
  }, [id]);

  const handleGuestNameChange = (index, value) => {
    const newGuestNames = [...guestNames];
    newGuestNames[index] = value;
    setGuestNames(newGuestNames);
  };

  const handleDownloadReceipt = () => {
    if (guestNames.some(name => name.trim() === '')) {
      setError('Please fill in all passenger names.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Room Reservation Receipt', 60, 10);

    doc.setFontSize(17);
    doc.text(`Room Info:`, 20, 30);
    doc.setFontSize(12);
    doc.text(`Hotel Name: ${roomPurchase?.room?.hotel?.name}`, 20, 40);
    doc.text(`Location: ${roomPurchase?.room?.hotel?.location}`, 20, 50);
    doc.text(`Room Type: ${roomPurchase.room.roomType}`, 20, 60);
    doc.text(
      `Check-In Date: ${new Date(roomPurchase.startDate).toLocaleDateString()}`,
      20,
      70
    );
    doc.text(
      `Check-Out Date: ${new Date(roomPurchase.endDate).toLocaleDateString()}`,
      20,
      80
    );
    doc.text(`Guests: ${roomPurchase.guests}`, 20, 90);
    doc.text(`Total Price: $${roomPurchase.totalPrice}`, 20, 100);

    doc.setFontSize(17);
    doc.text(`User Info:`, 140, 30);
    doc.setFontSize(12);
    doc.text(`User Name: ${profile.firstName} ${profile.lastName}`, 140, 40);
    doc.text(`User Email: ${profile.email}`, 140, 50);
 
    doc.setFontSize(17);
    doc.text(`Guest Names:`, 20, 120);
    doc.setFontSize(12);
    guestNames.forEach((name, index) => {
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
    doc.save('room_receipt.pdf');
  };

  const handleClose = () => {
    setError('');
  };

  const handleCheckout = (roomId) => {
    console.log(`Room with ID ${roomId} checked out!`);
  };

  if (!roomPurchase || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Room Checkout
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
            Hotel Name: {roomPurchase?.room?.hotel?.name || 'N/A'}
            </Typography>
            <Typography color="textSecondary">
            Location: {roomPurchase?.room?.hotel?.location || 'N/A'}
            </Typography>
            <Typography color="textSecondary">
              Room Type: {roomPurchase.room.roomType}
            </Typography>
            <Typography color="textSecondary">
              Check-In Date: {new Date(roomPurchase.startDate).toLocaleDateString()}
            </Typography>
            <Typography color="textSecondary">
              Check-Out Date: {new Date(roomPurchase.endDate).toLocaleDateString()}
            </Typography>
            <Typography color="textSecondary">
              Guests: {roomPurchase.guests}
            </Typography>
            <Typography color="textSecondary">
              Total Price: ${roomPurchase.totalPrice}
            </Typography>
            <Typography color="textSecondary">
              User Name: {profile.firstName} {profile.lastName}
            </Typography>
            <Typography color="textSecondary">
              User Email: {profile.email}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Guests Names</Typography>
              <Grid container spacing={2}>
                {guestNames.map((name, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      label={`Guest Name ${index + 1}`}
                      value={name}
                      onChange={(e) => handleGuestNameChange(index, e.target.value)}
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
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            role="alert"
            aria-live="assertive"
          >
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

export default CheckoutRoom;
