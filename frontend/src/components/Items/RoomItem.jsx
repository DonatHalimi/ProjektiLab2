import { East } from '@mui/icons-material';
import React from 'react';
import { Link } from 'react-router-dom';
import { CityFlag, formatDate, formatPrice } from '../../assets/CustomComponents';

const RoomItem = ({ room, purchaseDate, reservedNights, guests, totalPrice }) => {
    const { id, roomType, city, checkInDate, checkOutDate } = room || {};
    const symbol = '•';

    return (
        <Link to={`/profile/room-purchases/${id}`}>
            <div className="bg-white shadow rounded-md p-6 hover:shadow-md transition-shadow duration-300">
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
                    <div className="flex flex-col items-center">
                        <CityFlag city={city} />
                    </div>

                    <div className="flex flex-col items-center">
                        <p>Check-in Date: {formatDate(checkInDate)}</p>
                        <p>Check-out Date: {formatDate(checkOutDate)}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RoomItem;
