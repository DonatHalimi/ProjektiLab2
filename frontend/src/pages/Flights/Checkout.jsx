import { Box, Grid, TextField, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../services/authService';
import { getFlightPurchase } from '../../services/flightService';
import { BlueButton, CustomBox, CustomModal, CustomTypography, formatDate } from '../../assets/CustomComponents';
import { toast } from 'react-toastify';

const Checkout = ({ open, onClose, flightId }) => {
  const [flightPurchase, setFlightPurchase] = useState(null);
  const [passengerNames, setPassengerNames] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchFlightPurchase = async () => {
      try {
        const response = await getFlightPurchase(flightId);
        setFlightPurchase(response);
        setPassengerNames(Array(response.seatsReserved).fill(''));
      } catch (error) {
        toast.error('Failed to fetch flight purchase data.');
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await getCurrentUser();
        setProfile(response);
      } catch (error) {
        toast.error('Failed to fetch user profile.');
      }
    };

    if (open) {
      fetchFlightPurchase();
      fetchProfile();
    }
  }, [open, flightId]);

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
    doc.text('Flight Reservation Receipt', 60, 10);

    doc.setFontSize(17);
    doc.text(`Flight Info:`, 20, 30);
    doc.setFontSize(12);
    doc.text(`Flight: ${flightPurchase.flight.name}`, 20, 40);
    doc.text(`Departure: ${flightPurchase.flight.departureCity}`, 20, 50);
    doc.text(`Arrival: ${flightPurchase.flight.arrivalCity}`, 20, 60);
    doc.text(`Start Date: ${formatDate(flightPurchase.flight.startDate)}`, 20, 70);
    doc.text(`End Date: ${formatDate(flightPurchase.flight.endDate)}`, 20, 80);
    doc.text(`Seats Reserved: ${flightPurchase.seatsReserved}`, 20, 90);
    doc.text(`Total Price: $${flightPurchase.totalPrice}`, 20, 100);

    doc.setFontSize(17);
    doc.text(`User Info:`, 140, 30);
    doc.setFontSize(12);
    doc.text(`User Name: ${profile.firstName} ${profile.lastName}`, 140, 40);
    doc.text(`User Email: ${profile.email}`, 140, 50);

    doc.setFontSize(17);
    doc.text(`Passenger Names:`, 20, 120);
    doc.setFontSize(12);
    passengerNames.forEach((name, index) => {
      doc.text(`Seat ${index + 1}: ${name}`, 20, 130 + index * 10);
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

    doc.save(`flight_receipt_${currentDate}.pdf`);
  };

  if (!flightPurchase || !profile) {
    return null;
  }

  return (
    <CustomModal open={open} onClose={onClose}>
      <CustomBox>
        <CustomTypography variant="h5">Flight Checkout</CustomTypography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            margin='dense'
            label="Full Name"
            value={`${profile.firstName} ${profile.lastName}`}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <TextField
            margin='dense'
            label="User Email"
            value={profile.email}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Box>

        <TextField
          margin='dense'
          label="Flight Name"
          value={flightPurchase?.flight?.name || 'N/A'}
          fullWidth
          InputProps={{ readOnly: true }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            margin='dense'
            label="Departure City"
            value={flightPurchase?.flight?.departureCity || 'N/A'}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <TextField
            margin='dense'
            label="Arrival City"
            value={flightPurchase?.flight?.arrivalCity || 'N/A'}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Box>

        <TextField
          margin='dense'
          label="Seats Reserved"
          value={flightPurchase.seatsReserved}
          fullWidth
          InputProps={{ readOnly: true }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            margin='dense'
            label="Start Date"
            value={formatDate(flightPurchase.flight.startDate)}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <TextField
            margin='dense'
            label="End Date"
            value={formatDate(flightPurchase.flight.endDate)}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Box>

        <TextField
          margin='dense'
          label="Total Price"
          value={`$${flightPurchase.totalPrice}`}
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
                label={`Seat ${index + 1}`}
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

export default Checkout;