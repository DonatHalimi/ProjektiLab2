import { MenuItem, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography, formatDate } from '../../../assets/CustomComponents';
import { createTourPurchase, getTours } from '../../../services/tourService';
import { getUsers } from '../../../services/userService';

const AddTourPurchaseModal = ({ open, onClose, onAddSuccess }) => {
    const [formData, setFormData] = useState({
        userId: '',
        tourId: '',
        reservedTickets: '',
    });

    const [users, setUsers] = useState([]);
    const [tours, setTours] = useState([]);

    useEffect(() => {
        const fetchUsersAndTours = async () => {
            try {
                const [usersResponse, toursResponse] = await Promise.all([getUsers(), getTours()]);
                setUsers(usersResponse.data);
                setTours(toursResponse);
            } catch (error) {
                console.error('Error fetching users or tours:', error);
                toast.error('Failed to load users or tours');
            }
        };

        if (open) {
            fetchUsersAndTours();
            setFormData((prev) => ({ ...prev})); 
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddTourPurchase = async () => {
        const { userId, tourId,reservedTickets } = formData;

        if (!userId || !tourId || !reservedTickets) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const data = {
                userId: parseInt(userId, 10),
                tourId: parseInt(tourId, 10),
                reservedTickets: parseInt(reservedTickets, 10),
            };

            const response = await createTourPurchase(data);
            toast.success('Tour Purchase created successfully!');
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error('You do not have permission to perform this action');
            } else {
                toast.error('Error adding tour purchase');
            }
            console.error('Error adding tour purchase', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Tour Purchase</CustomTypography>

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
                    label="Select Tour"
                    name="tourId"
                    value={formData.tourId}
                    onChange={handleChange}
                    className="!mb-4"
                >
                    {tours.map((tour) => (
                        <MenuItem key={tour.id} value={tour.id}>
                            {`${tour.name} - ${tour.city} (${formatDate(tour.startDate)} to ${formatDate(tour.endDate)})`}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    required
                    label="Reserved Tickets (1-8)"
                    name="reservedTickets"
                    type="number"
                    value={formData.reservedTickets}
                    onChange={handleChange}
                    className="!mb-4"
                />

                <BlueButton
                    onClick={handleAddTourPurchase}
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

export default AddTourPurchaseModal;