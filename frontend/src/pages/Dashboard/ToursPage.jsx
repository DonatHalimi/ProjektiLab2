import React, { useEffect, useState } from 'react';
import { DashboardCityFlag, DashboardHeader, LoadingDataGrid } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddTourModal from '../../components/Modal/Tour/AddTourModal';
import EditTourModal from '../../components/Modal/Tour/EditTourModal';
import { getTours } from '../../services/tourService';

const ToursPage = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedTour, setSelectedTour] = useState(null);
    const [selectedTours, setSelectedTours] = useState([]);
    const [addTourOpen, setAddTourOpen] = useState(false);
    const [editTourOpen, setEditTourOpen] = useState(false);
    const [deleteTourOpen, setDeleteTourOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const fetchTours = async () => {
        try {
            setLoading(true);
            const response = await getTours();
            setTours(response);
        } catch (error) {
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const handleSelectTour = (tourId) => {
        const id = Array.isArray(tourId) ? tourId[0] : tourId;

        setSelectedTours((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((selectedId) => selectedId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedTours(tours.map(tour => tour.id));
        } else {
            setSelectedTours([]);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (tour) => {
        setSelectedTour(tour);
        setEditTourOpen(true);
    };

    const columns = [
        { key: 'name', label: 'Tour Name' },
        {
            key: 'city',
            label: 'City',
            render: (row) => <DashboardCityFlag city={row.city} />,
        },
        { key: 'startDate', label: 'Start Date', render: (tour) => new Date(tour.startDate).toLocaleDateString() },
        { key: 'endDate', label: 'End Date', render: (tour) => new Date(tour.endDate).toLocaleDateString() },
        { key: 'price', label: 'Price', render: (tour) => `€ ${tour.price.toFixed(2)}` },
        { key: 'capacity', label: 'Capacity' },
        { key: 'reservedTickets', label: 'Reserved Tickets' },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loading ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Tours"
                            selectedItems={selectedTours}
                            setAddItemOpen={setAddTourOpen}
                            setDeleteItemOpen={setDeleteTourOpen}
                            itemName="Tour"
                        />

                        <DashboardTable
                            columns={columns}
                            data={tours}
                            selectedItems={selectedTours}
                            onSelectItem={handleSelectTour}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            containerClassName='tour'
                        />
                    </>
                )}

                <AddTourModal open={addTourOpen} onClose={() => setAddTourOpen(false)} onAddSuccess={fetchTours} />
                <EditTourModal open={editTourOpen} onClose={() => setEditTourOpen(false)} tour={selectedTour} onEditSuccess={fetchTours} />
                <DeleteModal
                    open={deleteTourOpen}
                    onClose={() => setDeleteTourOpen(false)}
                    items={selectedTours.map(id => tours.find(tour => tour.id === id)).filter(tour => tour)}
                    onDeleteSuccess={() => {
                        fetchTours()
                        setSelectedTours([]);
                    }}
                    endpoint="/Tour/delete-bulk"
                    title="Delete Tours"
                    message="Are you sure you want to delete the selected tours?"
                />
            </div>
        </div >
    );
};

export default ToursPage;