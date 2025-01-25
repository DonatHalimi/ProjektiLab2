import { MenuItem, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { createRoomPurchase, getRooms } from '../../../services/roomService';
import { getUsers } from '../../../services/userService';

const AddRoomPurchaseModal = ({ open, onClose, onAddSuccess }) => {
    const [formData, setFormData] = useState({
        userId: '',
        roomId: '',
        startDate: '',
        endDate: '',
        guests: '',
        status: '',
    });

    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchUsersAndRooms = async () => {
            try {
                const [usersResponse, roomsResponse] = await Promise.all([getUsers(), getRooms()]);
                setUsers(usersResponse.data);
                setRooms(roomsResponse.data);
            } catch (error) {
                toast.error('Failed to load users or rooms');
            }
        };

        if (open) {
            fetchUsersAndRooms();
            setFormData({
                userId: '',
                roomId: '',
                startDate: '',
                endDate: '',
                guests: '',
                status: '',
            });
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddRoomPurchase = async () => {
        const { userId, roomId, startDate, endDate, guests, status } = formData;

        if (!userId || !roomId || !startDate || !endDate || !guests) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const data = {
                userId: parseInt(userId, 10),
                roomId: parseInt(roomId, 10),
                startDate,
                endDate,
                guests: parseInt(guests, 10),
                status,
            };

            const response = await createRoomPurchase(data);
            toast.success('Room Purchase created successfully!');
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            toast.error('Error adding room purchase');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Room Purchase</CustomTypography>

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
                    label="Select Room"
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleChange}
                    className="!mb-4"
                >
                    {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                            {room.roomType} - {room.hotelName || 'Hotel not available'}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    required
                    label="Check-in Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="!mb-4"
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    fullWidth
                    required
                    label="Check-out Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="!mb-4"
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    fullWidth
                    required
                    label="Guests"
                    name="guests"
                    type="number"
                    value={formData.guests}
                    onChange={handleChange}
                    className="!mb-4"
                />

                <BlueButton
                    onClick={handleAddRoomPurchase}
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

export default AddRoomPurchaseModal;
