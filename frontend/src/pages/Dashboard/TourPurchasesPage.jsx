import React, { useEffect, useState } from 'react';
import { DashboardCityFlag, DashboardHeader, formatDate } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddTourPurchaseModal from '../../components/Modal/TourPurchase/AddTourPurchaseModal';
import EditTourPurchaseModal from '../../components/Modal/TourPurchase/EditTourPurchaseModal';
import { getTourPurchases } from '../../services/tourService';

const TourPurchasesPage = () => {
    const [tourPurchases, setTourPurchases] = useState([]);

    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [selectedPurchases, setSelectedPurchases] = useState([]);
    const [addTourPurchaseOpen, setAddTourPurchaseOpen] = useState(false);
    const [editTourPurchaseOpen, setEditTourPurchaseOpen] = useState(false);
    const [deletePurchaseOpen, setDeletePurchaseOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const fetchTourPurchases = async () => {
        try {
            const response = await getTourPurchases();
            setTourPurchases(response);
        } catch (error) {
            console.error('Error fetching tour purchases:', error);
        }
    };

    useEffect(() => {
        fetchTourPurchases();
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
            setSelectedPurchases(tourPurchases.map(purchase => purchase.id));
        } else {
            setSelectedPurchases([]);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (purchase) => {
        setSelectedPurchase(purchase);
        setEditTourPurchaseOpen(true);
    };

    const columns = [
        {
            key: 'user',
            label: 'User',
            render: (row) => row.user ? `${row.user.email}` : 'Unknown',
        },
        {
            key: 'tourDetails',
            label: 'Tour Name',
            render: (row) => (
                <>
                    #{row.tour?.id} - {row.tour?.name}
                </>
            ),
        },
        {
            key: 'city',
            label: 'City',
            render: (row) => <DashboardCityFlag city={row.tour?.city} />,
        },
        {
            key: 'purchaseDate',
            label: 'Purchase Date',
            render: (row) => formatDate(row.purchaseDate),
        },
        { key: 'reservedTickets', label: 'Tickets Reserved' },
        {
            key: 'totalPrice',
            label: 'Total Price',
            render: (row) => `€ ${row.totalPrice}`
        },
        { key: 'actions', label: 'Actions' },
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardHeader
                    title="Tour Purchases"
                    selectedItems={selectedPurchases}
                    setAddItemOpen={setAddTourPurchaseOpen}
                    setDeleteItemOpen={setDeletePurchaseOpen}
                    itemName="Tour Purchase"
                />

                <DashboardTable
                    columns={columns}
                    data={tourPurchases}
                    selectedItems={selectedPurchases}
                    onSelectItem={handleSelectPurchase}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    onEdit={handleEdit}
                    containerClassName='tour-purchases'
                />

                <AddTourPurchaseModal open={addTourPurchaseOpen} onClose={() => setAddTourPurchaseOpen(false)} onAddSuccess={fetchTourPurchases} />
                <EditTourPurchaseModal open={editTourPurchaseOpen} onClose={() => setEditTourPurchaseOpen(false)} tour={selectedPurchase} onEditSuccess={fetchTourPurchases} />
                <DeleteModal
                    open={deletePurchaseOpen}
                    onClose={() => setDeletePurchaseOpen(false)}
                    items={selectedPurchases.map(id => tourPurchases.find(purchase => purchase.id === id)).filter(purchase => purchase)}
                    onDeleteSuccess={fetchTourPurchases}
                    endpoint="/TourPurchase/delete-bulk"
                    title="Delete Purchases"
                    message="Are you sure you want to delete the selected purchases?"
                />
            </div>
        </div>
    );
};

export default TourPurchasesPage;