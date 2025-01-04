import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { editFlight } from '../../../services/flightService';

const EditFlightModal = ({ open, onClose, flight, onEditSuccess }) => {
    const [flightDetails, setFlightDetails] = useState({
        name: '',
        departureCity: '',
        arrivalCity: '',
        startDate: '',
        endDate: '',
        price: '',
        capacity: '',
    });

    useEffect(() => {
        if (flight) {
            setFlightDetails({
                name: flight.name,
                departureCity: flight.departureCity,
                arrivalCity: flight.arrivalCity,
                startDate: flight.startDate,
                endDate: flight.endDate,
                price: flight.price,
                capacity: flight.capacity,
            });
        }
    }, [flight]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlightDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditFlight = async () => {
        const { name, departureCity, arrivalCity, startDate, endDate, price, capacity } = flightDetails;

        if (!name || !departureCity || !arrivalCity || !startDate || !endDate || !price || !capacity) {
            toast.error('Please fill in all the fields');
            return;
        }

        const updatedFlight = {
            id: flight.id,
            name,
            departureCity,
            arrivalCity,
            startDate,
            endDate,
            price: parseFloat(price),
            capacity: parseInt(capacity),
        };

        try {
            const response = await editFlight(flight.id, updatedFlight);
            toast.success('Flight updated successfully');
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            toast.error('Error updating flight');
            console.error('Error updating flight:', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Flight</CustomTypography>

                <TextField
                    fullWidth
                    required
                    label="Flight Name"
                    name="name"
                    value={flightDetails.name}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Departure City"
                    name="departureCity"
                    value={flightDetails.departureCity}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Arrival City"
                    name="arrivalCity"
                    value={flightDetails.arrivalCity}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    name="startDate"
                    value={flightDetails.startDate}
                    onChange={handleChange}
                    type="datetime-local"
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    name="endDate"
                    value={flightDetails.endDate}
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
                    value={flightDetails.price}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <TextField
                    fullWidth
                    required
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={flightDetails.capacity}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <BlueButton
                    onClick={handleEditFlight}
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

export default EditFlightModal;