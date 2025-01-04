import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { updateFlightPurchase } from '../../../services/flightService';

const EditFlightPurchaseModal = ({ open, onClose, flight, onEditSuccess }) => {
    const [formData, setFormData] = useState({
        flightId: '',
        purchaseDate: '',
        seatsReserved: '',
        userId: '',
    });

    useEffect(() => {
        if (flight) {
            setFormData({
                flightId: flight.flightId,
                purchaseDate: flight.purchaseDate.split('T')[0],
                seatsReserved: flight.seatsReserved,
                userId: flight.userId,
            });
        }
    }, [flight]);

    const handleEditFlightPurchase = async () => {
        if (!formData.flightId || !formData.seatsReserved || !formData.purchaseDate) {
            toast.error('Please fill all the fields', { closeOnClick: true });
            return;
        }

        const updatedData = {
            id: flight.id,
            flightId: formData.flightId,
            purchaseDate: formData.purchaseDate,
            seatsReserved: formData.seatsReserved,
        };

        try {
            const response = await updateFlightPurchase(flight.id, updatedData);
            toast.success('Flight Purchase updated successfully!');
            onEditSuccess(response);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error('You do not have permission to perform this action');
            } else {
                toast.error('Error updating flight purchase');
            }
            console.error('Error updating flight purchase', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Flight Purchase</CustomTypography>

                <TextField
                    fullWidth
                    required
                    label="Flight Name"
                    value={flight?.flight?.name || ''}
                    disabled
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Seats Reserved"
                    value={formData.seatsReserved}
                    onChange={(e) => setFormData({ ...formData, seatsReserved: e.target.value })}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Purchase Date"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="!mb-4"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <BlueButton
                    onClick={handleEditFlightPurchase}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save
                </BlueButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditFlightPurchaseModal;