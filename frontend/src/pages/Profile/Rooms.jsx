import React, { useEffect, useState } from 'react';
import {
    calculatePageCount,
    CustomPagination,
    EmptyState,
    getPaginatedItems,
    handlePageChange,
    Header,
    LoadingFlightItem as LoadingRoomItem,
    ProfileLayout,
} from '../../assets/CustomComponents';
import emptyRoomsImage from '../../assets/img/empty/not-found.png';
import Footer from '../../components/Footer';
import RoomItem from '../../components/Items/RoomItem';
import Navbar from '../../components/Navbar';
import { getCurrentUser } from '../../services/authService';
import { deleteRoomPurchase, getMyRoomPurchases } from '../../services/roomService';
import CheckoutRoom from '../Rooms/CheckoutRoom';

const itemsPerPage = 5;

const Rooms = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [roomPurchases, setRoomPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
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

        const fetchRoomPurchases = async () => {
            setLoading(true);
            try {
                const response = await getMyRoomPurchases(user.id);
                setRoomPurchases(response);
            } catch (error) {
                console.error('Error fetching room purchases:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomPurchases();
    }, [user]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const handleDeleteRoomPurchase = async (id) => {
        try {
            await deleteRoomPurchase(id);
            setRoomPurchases((prevRoomPurchases) =>
                prevRoomPurchases.filter((roomPurchase) => roomPurchase.id !== id)
            );
        } catch (error) {
            console.error('Error deleting room purchase:', error);
        }
    };

    const filteredRoomPurchases = Array.isArray(roomPurchases)
        ? roomPurchases.filter(({ room, totalPrice, reservedNights, purchaseDate }) => {
            const fields = [
                room?.roomType?.toLowerCase(),
                room?.city?.toLowerCase(),
                totalPrice?.toString(),
                reservedNights?.toString(),
                purchaseDate?.toLowerCase(),
            ];

            const matchesSearchTerm = fields.some((field) =>
                field?.includes(searchTerm.toLowerCase())
            );

            const matchesStatusFilter = statusFilter === 'All';

            return matchesSearchTerm && matchesStatusFilter;
        })
        : [];

    const pageCount = calculatePageCount(filteredRoomPurchases, itemsPerPage);
    const currentPageItems = getPaginatedItems(filteredRoomPurchases, currentPage, itemsPerPage);

    const openCheckoutModal = (roomId) => {
        setSelectedRoomId(roomId);
        setModalOpen(true);
    };

    const closeCheckoutModal = () => {
        setSelectedRoomId(null);
        setModalOpen(false);
    };

    return (
        <>
            <Navbar />
            <ProfileLayout>

                <Header
                    title='Rooms'
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showSearch={roomPurchases.length > 0}
                    showFilter={roomPurchases.length > 0}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    placeholder='Search room purchases...'
                />

                {loading ? (
                    <LoadingRoomItem />
                ) : filteredRoomPurchases.length === 0 ? (
                    <EmptyState
                        imageSrc={emptyRoomsImage}
                        context="rooms"
                        items={roomPurchases}
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                    />
                ) : (
                    <div className="flex flex-col">
                        <div className="grid gap-4 mb-3">
                            {currentPageItems.map(purchase => (
                                <RoomItem
                                    key={purchase.id}
                                    room={purchase.room}
                                    purchaseDate={purchase.purchaseDate}
                                    reservedNights={purchase.reservedNights}
                                    totalPrice={purchase.totalPrice}
                                    guests={purchase.guests}
                                    onDelete={() => handleDeleteRoomPurchase(purchase.id)}
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

            {filteredRoomPurchases.length === 1 && <div className='mb-48' />}
            <Footer />

            <CheckoutRoom open={modalOpen} onClose={closeCheckoutModal} roomId={selectedRoomId} />
        </>
    );
};

export default Rooms;