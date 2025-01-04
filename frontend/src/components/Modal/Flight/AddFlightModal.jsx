import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { createFlight } from '../../../services/flightService';

const AddFlightModal = ({ open, onClose, onAddSuccess }) => {
    const [flight, setFlight] = useState({
        name: '',
        departureCity: '',
        arrivalCity: '',
        startDate: '',
        endDate: '',
        price: '',
        capacity: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlight((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddFlight = async () => {
        const { name, departureCity, arrivalCity, startDate, endDate, price, capacity } = flight;

        if (!name || !departureCity || !arrivalCity || !startDate || !endDate || !price || !capacity) {
            toast.error('Please fill in all the fields');
            return;
        }

        const data = {
            name,
            departureCity,
            arrivalCity,
            startDate,
            endDate,
            price: parseFloat(price),
            capacity: parseInt(capacity),
            reservedSeats: 0
        };

        try {
            const response = await createFlight(data);
            toast.success('Flight added successfully');
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            toast.error('Error adding flight');
            console.error('Error adding flight:', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Flight</CustomTypography>

                <TextField
                    fullWidth
                    required
                    label="Flight Name"
                    name="name"
                    value={flight.name}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Departure City"
                    name="departureCity"
                    value={flight.departureCity}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Arrival City"
                    name="arrivalCity"
                    value={flight.arrivalCity}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    name="startDate"
                    value={flight.startDate}
                    onChange={handleChange}
                    type='datetime-local'
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    name="endDate"
                    value={flight.endDate}
                    onChange={handleChange}
                    type='datetime-local'
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Price"
                    name="price"
                    type="number"
                    value={flight.price}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={flight.capacity}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <BlueButton
                    onClick={handleAddFlight}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Add Flight
                </BlueButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddFlightModal;