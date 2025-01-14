import { Delete, East } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import { CityFlag, CustomDeleteModal, formatDate, formatPrice } from '../../assets/CustomComponents';

const FlightItem = ({
    flight,
    purchaseDate,
    seatsReserved,
    totalPrice,
    onDelete,
    onCheckout
}) => {
    const { id, name, departureCity, arrivalCity } = flight || {};
    const symbol = '•';

    // State to manage the confirmation modal
    const [open, setOpen] = useState(false);
    const [flightToDelete, setFlightToDelete] = useState(null);

    const handleOpen = (flightId) => {
        setFlightToDelete(flightId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFlightToDelete(null);
    };

    const handleDelete = () => {
        if (flightToDelete !== null) {
            onDelete(flightToDelete);  // Call the delete handler with the selected flight ID
        }
        handleClose(); // Close the modal after delete
    };

    return (
        <div className="bg-white shadow rounded-md p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                        <p>#{id}</p>
                        <span className="mx-1">{symbol}</span>
                        <p>{name}</p>
                        <span className="mx-1">{symbol}</span>
                        <p>{formatDate(purchaseDate)}</p>
                        <span className="mx-1">{symbol}</span>
                        <p>Seats Reserved: {seatsReserved}</p>
                    </div>
                    <p className="font-semibold">€ {formatPrice(totalPrice)}</p>
                </div>
            </div>

            <div className="border-t border-stone-100 mt-4 mb-4" />

            <div className="flex items-center justify-start gap-3">
                <div className="flex flex-col items-center">
                    <CityFlag city={departureCity} />
                </div>

                <East className="text-gray-400" />

                <div className="flex flex-col items-center">
                    <CityFlag city={arrivalCity} />
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
                <Button
                    onClick={() => handleOpen(id)}
                    color="error"
                    startIcon={<Delete />}
                >
                    Delete
                </Button>
                <Button
                    onClick={onCheckout}
                    color="success"
                >
                    Checkout
                </Button>
            </div>

            {/* Confirmation Modal */}
            <CustomDeleteModal
                open={open}
                onClose={handleClose}
                onDelete={handleDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this flight purchase?"
            />
        </div>
    );
};

export default FlightItem;