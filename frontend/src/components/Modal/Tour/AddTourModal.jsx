import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { createTour } from '../../../services/tourService';

const AddTourModal = ({ open, onClose, onAddSuccess }) => {
    const [tour, setTour] = useState({
        name: '',
        city: '',
        startDate: '',
        endDate: '',
        price: '',
        capacity: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTour((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddTour = async () => {
        const { name, city, startDate, endDate, price, capacity } = tour;

        if (!name || !city || !startDate || !endDate || !price || !capacity) {
            toast.error('Please fill in all the fields');
            return;
        }

        const data = {
            name,
            city,
            startDate,
            endDate,
            price: parseFloat(price),
            capacity: parseInt(capacity),
        };

        try {
            const response = await createTour(data);
            toast.success('Tour added successfully');
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            toast.error('Error adding tour');
            console.error('Error adding tour:', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Tour</CustomTypography>

                <TextField
                    fullWidth
                    required
                    label="Tour Name"
                    name="name"
                    value={tour.name}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="City"
                    name="city"
                    value={tour.city}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    name="startDate"
                    value={tour.startDate}
                    onChange={handleChange}
                    type="datetime-local"
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    name="endDate"
                    value={tour.endDate}
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
                    value={tour.price}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={tour.capacity}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <BlueButton
                    onClick={handleAddTour}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Add Tour
                </BlueButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddTourModal;