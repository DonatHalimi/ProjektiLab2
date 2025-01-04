import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { updateTourPurchase } from '../../../services/tourService';

const EditTourPurchaseModal = ({ open, onClose, tour, onEditSuccess }) => {
    const [formData, setFormData] = useState({
        userId: '',
        tourId: '',
        purchaseDate: '',
        reservedTickets: '',
    });

    useEffect(() => {
        if (tour) {
            setFormData({
                userId: tour.userId,
                tourId: tour.tourId,
                purchaseDate: tour.purchaseDate.split('T')[0],
                reservedTickets: tour.reservedTickets,
            });
        }
    }, [tour]);

    const handleEditTourPurchase = async () => {
        if (!formData.userId || !formData.tourId || !formData.reservedTickets || !formData.purchaseDate) {
            toast.error('Please fill all the fields', { closeOnClick: true });
            return;
        }

        const updatedData = {
            id: tour.id,
            userId: formData.userId,
            tourId: formData.tourId,
            purchaseDate: formData.purchaseDate,
            reservedTickets: formData.reservedTickets,
        };

        try {
            const response = await updateTourPurchase(tour.id, updatedData);
            toast.success('Tour Purchase updated successfully!');
            onEditSuccess(response);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error('You do not have permission to perform this action');
            } else {
                toast.error('Error updating tour purchase');
            }
            console.error('Error updating tour purchase', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Tour Purchase</CustomTypography>

                <TextField
                    fullWidth
                    required
                    label="Tour Name"
                    value={tour?.tour?.name || ''}
                    disabled
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Tickets Reserved"
                    value={formData.reservedTickets}
                    onChange={(e) => setFormData({ ...formData, reservedTickets: e.target.value })}
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
                />
                <BlueButton
                    onClick={handleEditTourPurchase}
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

export default EditTourPurchaseModal;