import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CityFlag, CustomDeleteModal, formatDate, formatFullDate, formatPrice } from '../../assets/CustomComponents';
import { Delete } from '@mui/icons-material';
import { Button } from '@mui/material';

const TourItem = ({ tour, purchaseDate, reservedTickets, totalPrice, onDelete, onCheckout }) => {
    const { id, name, city, startDate, endDate } = tour || {};
    const symbol = '•';


    const [open, setOpen] = useState(false);
    const [tourToDelete, setTourToDelete] = useState(null);

    const handleOpen = (tourId) => {
        setTourToDelete(tourId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTourToDelete(null);
    };

    const handleDelete = () => {
        if (tourToDelete !== null) {
            onDelete(tourToDelete); 
        }
        handleClose(); 
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
                        <p>Tickets Reserved: {reservedTickets}</p>
                    </div>
                    <p className="font-semibold">€ {formatPrice(totalPrice)}</p>
                </div>
            </div>

            <div className="border-t border-stone-100 mt-4 mb-4" />

            <div className="flex items-center gap-4">
                <CityFlag city={city} />
                <div className="flex flex-col items-start gap-2 ml-3">
                    <p>
                        <span className="font-semibold">Start Date:</span> {formatFullDate(startDate)}
                    </p>
                    <p>
                        <span className="font-semibold">End Date:</span> {formatFullDate(endDate)}
                    </p>
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
                    onClick={() => onCheckout(id)}
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
                message="Are you sure you want to delete this tour purchase?"
            />
        </div>
    );
};

export default TourItem;
