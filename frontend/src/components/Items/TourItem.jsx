import React from 'react';
import { Link } from 'react-router-dom';
import { CityFlag, formatDate, formatFullDate, formatPrice } from '../../assets/CustomComponents';

const TourItem = ({ tour, purchaseDate, reservedTickets, totalPrice }) => {
    const { id, name, city, startDate, endDate } = tour || {};
    const symbol = '•';

    return (
        <Link to={`/profile/tour-purchases/${id}`}>
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
            </div>
        </Link>
    );
};

export default TourItem;