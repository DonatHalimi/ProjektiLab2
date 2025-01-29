import React, { useEffect, useState } from 'react';
import { DashboardCityFlag, DashboardHeader, exportOptions, exportToExcel, exportToJSON, formatDate, LoadingDataGrid } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddFlightPurchaseModal from '../../components/Modal/FlightPurchase/AddFlightPurchaseModal';
import EditFlightPurchaseModal from '../../components/Modal/FlightPurchase/EditFlightPurchaseModal';
import { getFlightPurchases } from '../../services/flightService';

const FlightPurchasesPage = () => {
    const [flightPurchases, setFlightPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [selectedPurchases, setSelectedPurchases] = useState([]);
    const [addFlightPurchaseOpen, setAddFlightPurchaseOpen] = useState(false);
    const [editFlightPurchaseOpen, setEditFlightPurchaseOpen] = useState(false);
    const [deletePurchaseOpen, setDeletePurchaseOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const fetchFlightPurchases = async () => {
        try {
            setLoading(true);
            const response = await getFlightPurchases();
            setFlightPurchases(response);
        } catch (error) {
            console.error('Error fetching flight purchases:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlightPurchases();
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
            setSelectedPurchases(flightPurchases.map(purchase => purchase.id));
        } else {
            setSelectedPurchases([]);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (purchase) => {
        setSelectedPurchase(purchase);
        setEditFlightPurchaseOpen(true);
    };

    const columns = [
        {
            key: 'user',
            label: 'User',
            render: (row) => row.user ? `${row.user.email}` : 'Unknown',
        },
        {
            key: 'flightDetails',
            label: 'Flight Name',
            render: (row) => (
                <>
                    #{row.flight?.id} - {row.flight?.name}
                </>
            ),
        },
        {
            key: 'departureCity',
            label: 'Departure City',
            render: (row) => <DashboardCityFlag city={row.flight?.departureCity} />,
        },
        {
            key: 'arrivalCity',
            label: 'Arrival City',
            render: (row) => <DashboardCityFlag city={row.flight?.arrivalCity} />,
        },
        { key: 'purchaseDate', label: 'Purchase Date', render: (row) => formatDate(row.purchaseDate) },
        { key: 'seatsReserved', label: 'Seats Reserved' },
        { key: 'totalPrice', label: 'Total Price', render: (row) => `€ ${row.totalPrice}` },
        { key: 'actions', label: 'Actions' },
    ];

    const handleExport = (data, format) => {
        const flattenedData = data.map((purchase) => ({
            ...purchase,
            flight: purchase.flight ? purchase.flight.name : null,
            user: purchase.user ? purchase.user.email : null,
        }))

        format === 'excel' ? exportToExcel(flattenedData, 'flightPurchases_data') : exportToJSON(data, 'flightPurchases_data');
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loading ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Flight Purchases"
                            selectedItems={selectedPurchases}
                            setAddItemOpen={setAddFlightPurchaseOpen}
                            setDeleteItemOpen={setDeletePurchaseOpen}
                            itemName="Flight Purchase"
                            exportOptions={exportOptions(flightPurchases, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={flightPurchases}
                            selectedItems={selectedPurchases}
                            onSelectItem={handleSelectPurchase}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            containerClassName='flight-purchases'
                        />
                    </>
                )}

                <AddFlightPurchaseModal open={addFlightPurchaseOpen} onClose={() => setAddFlightPurchaseOpen(false)} onAddSuccess={fetchFlightPurchases} />
                <EditFlightPurchaseModal open={editFlightPurchaseOpen} onClose={() => setEditFlightPurchaseOpen(false)} flight={selectedPurchase} onEditSuccess={fetchFlightPurchases} />
                <DeleteModal
                    open={deletePurchaseOpen}
                    onClose={() => setDeletePurchaseOpen(false)}
                    items={selectedPurchases.map(id => flightPurchases.find(purchase => purchase.id === id)).filter(purchase => purchase)}
                    onDeleteSuccess={() => {
                        fetchFlightPurchases()
                        setSelectedPurchases([]);
                    }}
                    endpoint="/FlightPurchases/delete-bulk"
                    title="Delete Purchases"
                    message="Are you sure you want to delete the selected purchases?"
                />
            </div>
        </div>
    );
};

export default FlightPurchasesPage;