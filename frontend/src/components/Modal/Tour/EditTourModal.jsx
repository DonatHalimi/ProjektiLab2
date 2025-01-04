import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { updateTour } from '../../../services/tourService';

const EditTourModal = ({ open, onClose, tour, onEditSuccess }) => {
    const [tourDetails, setTourDetails] = useState({
        name: '',
        city: '',
        startDate: '',
        endDate: '',
        price: '',
        capacity: '',
    });

    useEffect(() => {
        if (tour) {
            setTourDetails({
                name: tour.name,
                city: tour.city,
                startDate: tour.startDate,
                endDate: tour.endDate,
                price: tour.price,
                capacity: tour.capacity,
            });
        }
    }, [tour]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTourDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditTour = async () => {
        const { name, city, startDate, endDate, price, capacity } = tourDetails;

        if (!name || !city || !startDate || !endDate || !price || !capacity) {
            toast.error('Please fill in all the fields');
            return;
        }

        const updatedTour = {
            id: tour.id,
            name,
            city,
            startDate,
            endDate,
            price: parseFloat(price),
            capacity: parseInt(capacity),
        };

        try {
            const response = await updateTour(tour.id, updatedTour);
            toast.success('Tour updated successfully');
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            toast.error('Error updating tour');
            console.error('Error updating tour:', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Tour</CustomTypography>

                <TextField
                    fullWidth
                    required
                    label="Tour Name"
                    name="name"
                    value={tourDetails.name}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="City"
                    name="city"
                    value={tourDetails.city}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    name="startDate"
                    value={tourDetails.startDate}
                    onChange={handleChange}
                    type="datetime-local"
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    name="endDate"
                    value={tourDetails.endDate}
                    onChange={handleChange}
                    type="datetime-local"
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Price"
                    name="price"
                    type="number"
                    value={tourDetails.price}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={tourDetails.capacity}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <BlueButton
                    onClick={handleEditTour}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save Changes
                </BlueButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditTourModal;