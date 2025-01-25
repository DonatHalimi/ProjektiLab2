import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../services/authService';
import { getRoomPurchase } from '../../services/roomService';
import { BlueButton, CustomBox, CustomModal, CustomTypography, formatDate } from '../../assets/CustomComponents';
import { toast } from 'react-toastify';

const CheckoutRoom = ({ open, onClose, roomId }) => {
  const [roomPurchase, setRoomPurchase] = useState(null);
  const [guestNames, setGuestNames] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchRoomPurchase = async () => {
      try {
        const response = await getRoomPurchase(roomId);
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

    if (open) {
      fetchRoomPurchase();
      fetchProfile();
    }
  }, [open, roomId]);

  const handleGuestNameChange = (index, value) => {
    const newGuestNames = [...guestNames];
    newGuestNames[index] = value;
    setGuestNames(newGuestNames);
  };

  const handleDownloadReceipt = () => {
    if (guestNames.some(name => name.trim() === '')) {
      toast.error('Please fill in all guest names.');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-CA');

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Room Reservation Receipt', 60, 10);

    doc.setFontSize(17);
    doc.text(`Room Info:`, 20, 30);
    doc.setFontSize(12);
    doc.text(`Hotel Name: ${roomPurchase?.room?.hotel?.name}`, 20, 40);
    doc.text(`Location: ${roomPurchase?.room?.hotel?.location}`, 20, 50);
    doc.text(`Room Type: ${roomPurchase.room.roomType}`, 20, 60);
    doc.text(`Check-In Date: ${formatDate(roomPurchase.startDate)}`, 20, 70);
    doc.text(`Check-Out Date: ${formatDate(roomPurchase.endDate)}`, 20, 80);
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
      doc.text(`Guest ${index + 1}: ${name}`, 20, 130 + index * 10);
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

    doc.save(`room_receipt_${currentDate}.pdf`);
  };

  if (!roomPurchase || !profile) {
    return null;
  }

  return (
    <CustomModal open={open} onClose={onClose}>
      <CustomBox>
        <CustomTypography variant="h5">Room Checkout</CustomTypography>

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
          label="Hotel Name"
          value={roomPurchase?.room?.hotel?.name || 'N/A'}
          fullWidth
          InputProps={{ readOnly: true }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            margin='dense'
            label="Location"
            value={roomPurchase?.room?.hotel?.location || 'N/A'}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <TextField
            margin='dense'
            label="Room Type"
            value={roomPurchase.room.roomType}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Box>

        <TextField
          margin='dense'
          label="Guests"
          value={roomPurchase.guests}
          fullWidth
          InputProps={{ readOnly: true }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            margin='dense'
            label="Check-In Date"
            value={new Date(roomPurchase.startDate).toLocaleDateString()}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin='dense'
            label="Check-Out Date"
            value={new Date(roomPurchase.endDate).toLocaleDateString()}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Box>

        <TextField
          margin='dense'
          label="Total Price"
          value={`$${roomPurchase.totalPrice}`}
          fullWidth
          InputProps={{ readOnly: true }}
        />

        <Typography variant="h6" className="!mb-2 !mt-2">
          Guest Names
        </Typography>
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

export default CheckoutRoom;