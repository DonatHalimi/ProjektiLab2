import { Box, Grid, TextField, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography, formatDate } from '../../assets/CustomComponents';
import { getCurrentUser } from '../../services/authService';
import { getTourPurchase } from '../../services/tourService';

const CheckoutTour = ({ open, onClose, tourId }) => {
  const [tourPurchase, setTourPurchase] = useState(null);
  const [passengerNames, setPassengerNames] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchTourPurchase = async () => {
      try {
        const response = await getTourPurchase(tourId);
        setTourPurchase(response);
        setPassengerNames(Array(response.reservedTickets).fill(''));
      } catch (error) {
        toast.error('Failed to fetch tour purchase data.');
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await getCurrentUser();
        setProfile(response);
      } catch (error) {
        toast.error('Failed to fetch profile data.');
      }
    };

    if (open) {
      fetchTourPurchase();
      fetchProfile();
    }
  }, [open, tourId]);

  const handlePassengerNameChange = (index, value) => {
    const newPassengerNames = [...passengerNames];
    newPassengerNames[index] = value;
    setPassengerNames(newPassengerNames);
  };

  const handleDownloadReceipt = () => {
    if (passengerNames.some(name => name.trim() === '')) {
      toast.error('Please fill in all passenger names.');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-CA');

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Tour Reservation Receipt', 60, 10);

    doc.setFontSize(17);
    doc.text(`Tour Info:`, 20, 30);
    doc.setFontSize(12);
    doc.text(`Tour: ${tourPurchase.tour.name}`, 20, 40);
    doc.text(`City: ${tourPurchase.tour.city}`, 20, 50);
    doc.text(`Start Date: ${formatDate(tourPurchase.tour.startDate)}`, 20, 70);
    doc.text(`End Date: ${formatDate(tourPurchase.tour.endDate)}`, 20, 80);
    doc.text(`Reserved Tickets: ${tourPurchase.reservedTickets}`, 20, 90);
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

    doc.save(`tour_receipt_${currentDate}.pdf`);
  };

  if (!tourPurchase || !profile) {
    return null;
  }

  return (
    <CustomModal open={open} onClose={onClose}>
      <CustomBox>
        <CustomTypography variant="h5">Tour Checkout</CustomTypography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            margin="dense"
            label="Full Name"
            value={`${profile.firstName} ${profile.lastName}`}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <TextField
            margin="dense"
            label="User Email"
            value={profile.email}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Box>

        <TextField
          margin="dense"
          label="Tour Name"
          value={tourPurchase?.tour?.name || 'N/A'}
          fullWidth
          InputProps={{ readOnly: true }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            margin="dense"
            label="City"
            value={tourPurchase?.tour?.city || 'N/A'}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <TextField
            margin="dense"
            label="Reserved Tickets"
            value={tourPurchase.reservedTickets}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            margin="dense"
            label="Start Date"
            value={new Date(tourPurchase.tour.startDate).toLocaleDateString()}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <TextField
            margin="dense"
            label="End Date"
            value={new Date(tourPurchase.tour.endDate).toLocaleDateString()}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Box>

        <TextField
          margin="dense"
          label="Total Price"
          value={`$${tourPurchase.totalPrice}`}
          fullWidth
          InputProps={{ readOnly: true }}
        />

        <Typography variant="h6" className="!mb-2 !mt-2">
          Passenger Names
        </Typography>
        <Grid container spacing={2}>
          {passengerNames.map((name, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <TextField
                label={`Passenger ${index + 1}`}
                value={name}
                onChange={(e) => handlePassengerNameChange(index, e.target.value)}
                fullWidth
                required
              />
            </Grid>
          ))}
        </Grid>

        {/* <Button variant="contained" color="primary" sx={{ mr: 2 }}>
          Proceed to Payment
        </Button> */}
        <BlueButton onClick={handleDownloadReceipt} variant="contained" color="primary" className="w-full !mt-4">
          Download Receipt
        </BlueButton>
      </CustomBox>
    </CustomModal>
  );
};

export default CheckoutTour;