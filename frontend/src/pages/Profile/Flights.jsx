import React, { useEffect, useState } from 'react';
import { calculatePageCount, CustomPagination, EmptyState, getPaginatedItems, handlePageChange, Header, LoadingFlightItem, ProfileLayout } from '../../assets/CustomComponents';
import emptyFlightsImage from '../../assets/img/empty/not-found.png';
import Footer from '../../components/Footer';
import FlightItem from '../../components/Items/FlightItem';
import Navbar from '../../components/Navbar';
import { getCurrentUser } from '../../services/authService';
import { deleteFlightPurchase, getMyFlightPurchases } from '../../services/flightService';
import Checkout from '../Flights/Checkout';

const itemsPerPage = 5;

const Flights = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [flightPurchases, setFlightPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [selectedFlightId, setSelectedFlightId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        const fetchFlightPurchases = async () => {
            setLoading(true);

            try {
                const response = await getMyFlightPurchases(user.id);
                setFlightPurchases(response);
            } catch (error) {
                console.error('Error fetching flight purchases:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlightPurchases();
    }, [user]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const handleDelete = async (id) => {
        try {
            await deleteFlightPurchase(id);
            setFlightPurchases((prev) => prev.filter((purchase) => purchase.id !== id));
        } catch (error) {
            console.error('Error deleting flight purchase:', error);
        }
    };

    const filteredFlightPurchases = Array.isArray(flightPurchases)
        ? flightPurchases.filter(({ flight, totalPrice, seatsReserved, purchaseDate, departureCity, arrivalCity }) => {
            const fields = [
                flight?.name?.toLowerCase(),
                totalPrice?.toString(),
                seatsReserved?.toString(),
                purchaseDate?.toLowerCase(),
                flight?.departureCity?.toLowerCase(),
                flight?.arrivalCity?.toLowerCase(),
            ];

            const matchesSearchTerm = fields.some((field) =>
                field?.includes(searchTerm.toLowerCase())
            );

            const matchesStatusFilter = statusFilter === 'All';

            return matchesSearchTerm && matchesStatusFilter;
        })
        : [];

    const pageCount = calculatePageCount(filteredFlightPurchases, itemsPerPage);
    const currentPageItems = getPaginatedItems(filteredFlightPurchases, currentPage, itemsPerPage);

    const openCheckoutModal = (tourId) => {
        setSelectedFlightId(tourId);
        setModalOpen(true);
    };

    const closeCheckoutModal = () => {
        setSelectedFlightId(null);
        setModalOpen(false);
    };

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header
                    title='Flights'
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showSearch={flightPurchases.length > 0}
                    showFilter={flightPurchases.length > 0}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    placeholder='Search flight purchases...'
                />

                {loading ? (
                    <LoadingFlightItem />
                ) : filteredFlightPurchases.length === 0 ? (
                    <EmptyState
                        imageSrc={emptyFlightsImage}
                        context="flights"
                        items={flightPurchases}
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                    />
                ) : (
                    <div className="flex flex-col">
                        <div className="grid gap-4 mb-3">
                            {currentPageItems.map((purchase) => (
                                <FlightItem
                                    key={purchase.id}
                                    flight={purchase.flight}
                                    purchaseDate={purchase.purchaseDate}
                                    seatsReserved={purchase.seatsReserved}
                                    totalPrice={purchase.totalPrice}
                                    onDelete={() => handleDelete(purchase.id)}
                                    onCheckout={() => openCheckoutModal(purchase.id)}
                                />
                            ))}
                        </div>

                        <div className="flex justify-start sm:justify-start">
                            <CustomPagination
                                count={pageCount}
                                page={currentPage}
                                onChange={handlePageChange(setCurrentPage)}
                                size="medium"
                                sx={{
                                    position: 'relative',
                                    bottom: '4px',
                                    '& .MuiPagination-ul': {
                                        justifyContent: 'flex-start',
                                    },
                                }}
                            />
                        </div>
                    </div>
                )}
            </ProfileLayout>

            {filteredFlightPurchases.length === 1 && <div className='mb-48' />}
            <Footer />

            <Checkout open={modalOpen} onClose={closeCheckoutModal} flightId={selectedFlightId} />
        </>
    );
};

export default Flights;