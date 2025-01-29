import React, { useEffect, useState } from 'react';
import { DashboardHeader, exportOptions, exportToExcel, exportToJSON, formatDate, LoadingDataGrid } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddRoomPurchaseModal from '../../components/Modal/RoomPurchase/AddRoomPurchaseModal';
import EditRoomPurchaseModal from '../../components/Modal/RoomPurchase/EditRoomPurchaseModal';
import { getRoomPurchases } from '../../services/roomService';

const RoomPurchasesPage = () => {
    const [roomPurchases, setRoomPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [selectedPurchases, setSelectedPurchases] = useState([]);
    const [addRoomPurchaseOpen, setAddRoomPurchaseOpen] = useState(false);
    const [editRoomPurchaseOpen, setEditRoomPurchaseOpen] = useState(false);
    const [deletePurchaseOpen, setDeletePurchaseOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const fetchRoomPurchases = async () => {
        try {
            setLoading(true);
            const response = await getRoomPurchases();
            setRoomPurchases(response);
        } catch (error) {
            console.error('Error fetching room purchases:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoomPurchases();
    }, []);

    const handleSelectPurchase = (purchaseId) => {
        const id = Array.isArray(purchaseId) ? purchaseId[0] : purchaseId;

        setSelectedPurchases((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((selectedId) => selectedId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedPurchases(roomPurchases.map(purchase => purchase.id));
        } else {
            setSelectedPurchases([]);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (purchase) => {
        setSelectedPurchase(purchase);
        setEditRoomPurchaseOpen(true);
    };

    const columns = [
        { key: 'user', label: 'User', render: (row) => row.user ? `${row.user.email}` : 'Unknown', },
        { key: 'roomDetails', label: 'Room Type', render: (row) => (<>{row.room?.roomType}</>), },
        { key: 'hotel', label: 'Hotel Name', render: (row) => (<>{row.room?.hotel?.name}</>), },
        { key: 'location', label: 'Location', render: (row) => (<>{row.room?.hotel?.location}</>), },
        { key: 'checkInDate', label: 'Check-In Date', render: (row) => formatDate(row.startDate), },
        { key: 'checkOutDate', label: 'Check-Out Date', render: (row) => formatDate(row.endDate), },
        { key: 'guests', label: 'Guests' },
        { key: 'totalPrice', label: 'Total Price', render: (row) => `€ ${row.totalPrice}` },
        { key: 'Status', label: 'Status', render: (row) => `${row.status}` },
        { key: 'actions', label: 'Actions' },
    ];

    const handleExport = (data, format) => {
        const flattenedData = data.map((purchase) => ({
            ...purchase,
            user: purchase.user ? purchase.user.email : null,
            room: purchase.room ? purchase.room.roomType : null,
        }))

        format === 'excel' ? exportToExcel(flattenedData, 'roomPurchases_data') : exportToJSON(data, 'roomPurchases_data');
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loading ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Room Purchases"
                            selectedItems={selectedPurchases}
                            setAddItemOpen={setAddRoomPurchaseOpen}
                            setDeleteItemOpen={setDeletePurchaseOpen}
                            itemName="Room Purchase"
                            exportOptions={exportOptions(roomPurchases, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={roomPurchases}
                            selectedItems={selectedPurchases}
                            onSelectItem={handleSelectPurchase}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            containerClassName='room-purchases'
                        />
                    </>
                )}

                <AddRoomPurchaseModal open={addRoomPurchaseOpen} onClose={() => setAddRoomPurchaseOpen(false)} onAddSuccess={fetchRoomPurchases} />
                <EditRoomPurchaseModal open={editRoomPurchaseOpen} onClose={() => setEditRoomPurchaseOpen(false)} roomPurchase={selectedPurchase} onEditSuccess={fetchRoomPurchases} />
                <DeleteModal
                    open={deletePurchaseOpen}
                    onClose={() => setDeletePurchaseOpen(false)}
                    items={selectedPurchases.map(id => roomPurchases.find(purchase => purchase.id === id)).filter(purchase => purchase)}
                    onDeleteSuccess={() => {
                        fetchRoomPurchases()
                        setSelectedPurchases([]);
                    }}
                    endpoint="/RoomPurchase/delete-bulk"
                    title="Delete Room Purchases"
                    message="Are you sure you want to delete the selected room purchases?"
                />
            </div>
        </div>
    );
};

export default RoomPurchasesPage;
