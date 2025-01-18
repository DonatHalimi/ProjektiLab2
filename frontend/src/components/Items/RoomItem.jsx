import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CityFlag, formatDate, formatPrice, ImagePreviewModal, CustomDeleteModal } from '../../assets/CustomComponents';
import { getRoomImage } from '../../services/roomService';
import { Button } from '@mui/material';
import { Delete } from '@mui/icons-material';

const RoomItem = ({ room, purchaseDate, reservedNights, guests, totalPrice, onDelete, onCheckout }) => {
    const { id, roomType, city, checkInDate, checkOutDate, images } = room || {};
    const [imageUrls, setImageUrls] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const symbol = '•';

    const handleOpen = (roomId) => {
        setRoomToDelete(roomId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setRoomToDelete(null);
    };

    const handleDelete = () => {
        if (roomToDelete !== null) {
            onDelete(roomToDelete); 
        }
        handleClose(); 
    };

    useEffect(() => {
        const fetchImages = async () => {
            if (!images || images.length === 0) return;
            try {
                const urls = await Promise.all(images.map(async (filename) => await getRoomImage(filename)));
                setImageUrls(urls);
            } catch (error) {
                console.error('Error fetching room images:', error);
            }
        };

        fetchImages();
    }, [images]);

    return (
        <>
            <div className="bg-white shadow rounded-md p-6 hover:shadow-md transition-shadow duration-300">
                <Link to={`/profile/room-purchases/${id}`}>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between text-sm">
                            <div className="flex items-center">
                                <p>#{id}</p>
                                <span className="mx-1">{symbol}</span>
                                <p>{roomType}</p>
                                <span className="mx-1">{symbol}</span>
                                <p>{formatDate(purchaseDate)}</p>
                                <span className="mx-1">{symbol}</span>
                                <p>Guests: {guests}</p>
                                <span className="mx-1">{symbol}</span>
                                <p>Nights Reserved: {reservedNights}</p>
                            </div>
                            <p className="font-semibold">€ {formatPrice(totalPrice)}</p>
                        </div>
                    </div>

                    <div className="border-t border-stone-100 mt-4 mb-4" />

                    <div className="flex items-center justify-start gap-3">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                {imageUrls.length > 0 ? (
                                    <img
                                        src={imageUrls[0]}
                                        alt="Room"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setModalOpen(true);
                                        }}
                                        className="w-20 h-20 object-cover rounded-md cursor-pointer"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <CityFlag city={city} />

                            <div className="flex flex-col items-start gap-2 ml-3">
                                <p>
                                    <span className="font-semibold">Check-in Date:</span> {formatDate(checkInDate)}
                                </p>
                                <p>
                                    <span className="font-semibold">Check-out Date:</span> {formatDate(checkOutDate)}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>

                <div className="flex justify-end gap-4 mt-4">
                    {/* Delete Button */}
                    <Button
                        onClick={() => handleOpen(id)}
                        color="error"
                        startIcon={<Delete />}
                    >
                        Delete
                    </Button>

                    {/* Checkout Button */}
                    <Button
                        onClick={() => onCheckout(id)}
                        color="success"
                    >
                        Checkout
                    </Button>
                </div>
            </div>

            {/* Confirmation Modal */}
            <CustomDeleteModal
                open={open}
                onClose={handleClose}
                onDelete={handleDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this room purchase?"
            />

            {/* Image Preview Modal */}
            <ImagePreviewModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                imageUrls={imageUrls}
            />
        </>
    );
};

export default RoomItem;
