import React, { useEffect, useState } from 'react';
import {
    calculatePageCount,
    CustomPagination,
    EmptyState,
    getPaginatedItems,
    handlePageChange,
    Header,
    LoadingFlightItem as LoadingTourItem,
    ProfileLayout
} from '../../assets/CustomComponents';
import emptyToursImage from '../../assets/img/empty/not-found.png';
import Footer from '../../components/Footer';
import TourItem from '../../components/Items/TourItem';
import Navbar from '../../components/Navbar';
import { getCurrentUser } from '../../services/authService';
import { deleteTourPurchase, getMyTourPurchases } from '../../services/tourService';
import CheckoutTour from '../Tours/CheckoutTour';

const itemsPerPage = 5;

const Tours = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [tourPurchases, setTourPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [selectedTourId, setSelectedTourId] = useState(null);
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

        const fetchTourPurchases = async () => {
            setLoading(true);

            try {
                const response = await getMyTourPurchases(user.id);
                setTourPurchases(response);
            } catch (error) {
                console.error('Error fetching tour purchases:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTourPurchases();
    }, [user]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const handleDelete = async (id) => {
        try {
            await deleteTourPurchase(id);
            setTourPurchases((prev) => prev.filter((purchase) => purchase.id !== id));
        } catch (error) {
            console.error('Error deleting tour purchase:', error);
        }
    };

    const filteredTourPurchases = Array.isArray(tourPurchases)
        ? tourPurchases.filter(({ tour, totalPrice, reservedTickets, purchaseDate }) => {
            const fields = [
                tour?.name?.toLowerCase(),
                tour?.city?.toLowerCase(),
                totalPrice?.toString(),
                reservedTickets?.toString(),
                purchaseDate?.toLowerCase(),
            ];

            const matchesSearchTerm = fields.some((field) =>
                field?.includes(searchTerm.toLowerCase())
            );

            const matchesStatusFilter = statusFilter === 'All';

            return matchesSearchTerm && matchesStatusFilter;
        })
        : [];

    const pageCount = calculatePageCount(filteredTourPurchases, itemsPerPage);
    const currentPageItems = getPaginatedItems(filteredTourPurchases, currentPage, itemsPerPage);

    const openCheckoutModal = (tourId) => {
        setSelectedTourId(tourId);
        setModalOpen(true);
    };

    const closeCheckoutModal = () => {
        setSelectedTourId(null);
        setModalOpen(false);
    };

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header
                    title='Tours'
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showSearch={tourPurchases.length > 0}
                    showFilter={tourPurchases.length > 0}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    placeholder='Search tour purchases...'
                />

                {loading ? (
                    <LoadingTourItem />
                ) : filteredTourPurchases.length === 0 ? (
                    <EmptyState
                        imageSrc={emptyToursImage}
                        context="tours"
                        items={tourPurchases}
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                    />
                ) : (
                    <div className="flex flex-col">
                        <div className="grid gap-4 mb-3">
                            {currentPageItems.map((purchase) => (
                                <TourItem
                                    key={purchase.id}
                                    tour={purchase.tour}
                                    purchaseDate={purchase.purchaseDate}
                                    reservedTickets={purchase.reservedTickets}
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

            {filteredTourPurchases.length === 1 && <div className='mb-48' />}
            <Footer />

            <CheckoutTour open={modalOpen} onClose={closeCheckoutModal} tourId={selectedTourId} />
        </>
    );
};

export default Tours;
