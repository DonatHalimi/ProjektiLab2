import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CityFlag, formatDate, formatPrice, ImagePreviewModal } from '../../assets/CustomComponents';
import { getRoomImage } from '../../services/roomService';

const RoomItem = ({ room, purchaseDate, reservedNights, guests, totalPrice }) => {
    const { id, roomType, city, checkInDate, checkOutDate, images } = room || {};
    const [imageUrls, setImageUrls] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const symbol = '•';

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
            </div>

            <ImagePreviewModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                imageUrls={imageUrls}
            />
        </>
    );
};

export default RoomItem;