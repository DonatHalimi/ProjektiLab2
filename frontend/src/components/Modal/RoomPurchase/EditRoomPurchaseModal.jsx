import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { getRooms, updateRoomPurchase } from '../../../services/roomService';

const EditRoomPurchaseModal = ({ open, onClose, roomPurchase, onEditSuccess }) => {
    const [formData, setFormData] = useState({
        roomId: '',
        startDate: '',
        endDate: '',
        guests: '',
        price: 0,
        status: 'Confirmed',
    });

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const roomsResponse = await getRooms();
                setRooms(roomsResponse.data);
            } catch (error) {
                toast.error('Failed to load rooms');
            }
        };

        if (open) {
            fetchRooms();

            // Prepopulate form with current data (without changing userId)
            setFormData({
                roomId: roomPurchase.roomId || '',
                startDate: roomPurchase.startDate ? roomPurchase.startDate.split('T')[0] : '',
                endDate: roomPurchase.endDate ? roomPurchase.endDate.split('T')[0] : '',
                guests: roomPurchase.guests || '',
                price: roomPurchase.price || 0,
                status: roomPurchase.status || 'Confirmed',
            });
        }
    }, [open, roomPurchase]);

    // Function to calculate the total price based on the room price and the number of nights
    const calculateTotalPrice = (startDate, endDate, roomId) => {
        const room = rooms.find(room => room.id === roomId);
        if (!room || !startDate || !endDate) return 0;

        // Calculate the number of nights between the start and end date
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end - start;
        const numNights = timeDiff / (1000 * 3600 * 24);

        if (numNights <= 0) {
            return 0;
        }

        // Calculate the price based on the number of nights
        return room.pricePerNight * numNights;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updatedFormData = { ...prev, [name]: value };

            // If startDate or endDate changes, recalculate the price
            if (name === 'startDate' || name === 'endDate') {
                updatedFormData.price = calculateTotalPrice(updatedFormData.startDate, updatedFormData.endDate, updatedFormData.roomId);
            }

            if (name === 'guests') {
                const room = rooms.find(room => room.id === updatedFormData.roomId);
                if (room && updatedFormData.guests > room.capacity) {
                    toast.error('Number of guests exceeds room capacity');
                    updatedFormData.guests = prev.guests;
                }
            }

            return updatedFormData;
        });
    };

    const handleEditRoomPurchase = async () => {
        const { roomId, startDate, endDate, guests, price, status } = formData;

        if (!roomId || !startDate || !endDate || !guests) {
            toast.error('Please fill in all fields');
            return;
        }

        const room = rooms.find(room => room.id === roomId);
        if (room && guests > room.capacity) {
            toast.error('Number of guests exceeds room capacity');
            return;
        }

        try {
            const data = {
                id: roomPurchase.id,
                roomId: parseInt(roomId, 10),
                startDate,
                endDate,
                guests: parseInt(guests, 10),
                price,
                status,
            };

            const response = await updateRoomPurchase(roomPurchase.id, data);
            toast.success('Room Purchase updated successfully!');
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            toast.error('Error updating room purchase');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Room Purchase</CustomTypography>

                <FormControl fullWidth required className="!mb-4">
                    <InputLabel>Room</InputLabel>
                    <Select
                        name="roomId"
                        value={formData.roomId || ''}
                        onChange={handleChange}
                        label="Room"
                    >
                        {rooms.map((room) => (
                            <MenuItem key={room.id} value={room.id}>
                                {room.roomType} - {room.hotelName || 'Hotel not available'}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

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
                    InputLabelProps={{ shrink: true }}
                    className="!mb-4"
                />

                <TextField
                    fullWidth
                    required
                    label="Guests"
                    name="guests"
                    type="number"
                    value={formData.guests}
                    onChange={handleChange}
                    inputProps={{ min: 1 }}
                    className="!mb-4"
                />

                <FormControl fullWidth required className="!mb-4">
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Status"
                    >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Confirmed">Confirmed</MenuItem>
                        <MenuItem value="Canceled">Canceled</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Total Price"
                    value={formData.price || 0}
                    disabled
                    className="!mb-4"
                />

                <BlueButton
                    onClick={handleEditRoomPurchase}
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

export default EditRoomPurchaseModal;