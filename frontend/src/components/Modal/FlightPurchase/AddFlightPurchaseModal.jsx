import { MenuItem, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { createFlightPurchase, getFlights } from '../../../services/flightService';
import { getUsers } from '../../../services/userService';

const AddFlightPurchaseModal = ({ open, onClose, onAddSuccess }) => {
    const [formData, setFormData] = useState({
        userId: '',
        flightId: '',
        purchaseDate: '',
        seatsReserved: '',
    });

    const [users, setUsers] = useState([]);
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        const fetchUsersAndFlights = async () => {
            try {
                const [usersResponse, flightsResponse] = await Promise.all([getUsers(), getFlights()]);
                setUsers(usersResponse.data);
                setFlights(flightsResponse);
            } catch (error) {
                console.error('Error fetching users or flights:', error);
                toast.error('Failed to load users or flights');
            }
        };

        if (open) {
            fetchUsersAndFlights();
            setFormData((prev) => ({ ...prev, purchaseDate: new Date().toISOString().split('T')[0] })); // todays date
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddFlightPurchase = async () => {
        const { userId, flightId, purchaseDate, seatsReserved } = formData;

        if (!userId || !flightId || !purchaseDate || !seatsReserved) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const data = {
                userId: parseInt(userId, 10),
                flightId: parseInt(flightId, 10),
                purchaseDate,
                seatsReserved: parseInt(seatsReserved, 10),
            };

            const response = await createFlightPurchase(data);
            toast.success('Flight Purchase created successfully!');
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error('You do not have permission to perform this action');
            } else {
                toast.error('Error adding flight purchase');
            }
            console.error('Error adding flight purchase', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Flight Purchase</CustomTypography>

                <TextField
                    fullWidth
                    select
                    required
                    label="Select User"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="!mb-4"
                >
                    {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                            {`${user.firstName} ${user.lastName} - ${user.email}`}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    select
                    required
                    label="Select Flight"
                    name="flightId"
                    value={formData.flightId}
                    onChange={handleChange}
                    className="!mb-4"
                >
                    {flights.map((flight) => (
                        <MenuItem key={flight.id} value={flight.id}>
                            {`${flight.name} - ${flight.departureCity} to ${flight.arrivalCity}`}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    required
                    type="date"
                    label="Purchase Date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="!mb-4"
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    fullWidth
                    required
                    label="Seats Reserved (1-8)"
                    name="seatsReserved"
                    type="number"
                    value={formData.seatsReserved}
                    onChange={handleChange}
                    className="!mb-4"
                />

                <BlueButton
                    onClick={handleAddFlightPurchase}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Add
                </BlueButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddFlightPurchaseModal;