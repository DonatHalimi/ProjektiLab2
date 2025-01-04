import { East } from '@mui/icons-material';
import React from 'react';
import { Link } from 'react-router-dom';
import { CityFlag, formatDate, formatPrice } from '../../assets/CustomComponents';

const FlightItem = ({ flight, purchaseDate, seatsReserved, totalPrice }) => {
    const { id, name, departureCity, arrivalCity } = flight || {};
    const symbol = '•';

    return (
        <Link to={`/profile/flight-purchases/${id}`}>
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
            </div>
        </Link>
    );
};

export default FlightItem;