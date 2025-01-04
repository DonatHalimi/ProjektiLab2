import React, { useEffect, useState } from 'react';
import { DashboardCityFlag, DashboardHeader, formatDate } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddFlightModal from '../../components/Modal/Flight/AddFlightModal';
import EditFlightModal from '../../components/Modal/Flight/EditFlightModal';
import { getFlights } from '../../services/flightService';

const FlightsPage = () => {
  const [flights, setFlights] = useState([]);

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedFlights, setSelectedFlights] = useState([]);
  const [addFlightOpen, setAddFlightOpen] = useState(false);
  const [editFlightOpen, setEditFlightOpen] = useState(false);
  const [deleteFlightOpen, setDeleteFlightOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const fetchFlights = async () => {
    try {
      const response = await getFlights();
      setFlights(response);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleSelectFlight = (flightId) => {
    const id = Array.isArray(flightId) ? flightId[0] : flightId;

    setSelectedFlights((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFlights(flights.map(flight => flight._id));
    } else {
      setSelectedFlights([]);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleEdit = (flight) => {
    setSelectedFlight(flight);
    setEditFlightOpen(true);
  };

  const columns = [
    { key: 'name', label: 'Flight Name' },
    {
      key: 'departureCity',
      label: 'Departure City',
      render: (row) => <DashboardCityFlag city={row.departureCity} />,
    },
    {
      key: 'arrivalCity',
      label: 'Arrival City',
      render: (row) => <DashboardCityFlag city={row.arrivalCity} />,
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (row) => formatDate(row.startDate),
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (row) => formatDate(row.endDate),
    },
    { key: 'capacity', label: 'Capacity' },
    { key: 'price', label: 'Price', render: (row) => `€ ${row.price}` },
    { key: 'reservedSeats', label: 'Reserved Seats' },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
      <div className='flex flex-col items-center justify-center'>
        <DashboardHeader
          title="Flights"
          selectedItems={selectedFlights}
          setAddItemOpen={setAddFlightOpen}
          setDeleteItemOpen={setDeleteFlightOpen}
          itemName="Flight"
        />

        <DashboardTable
          columns={columns}
          data={flights}
          selectedItems={selectedFlights}
          onSelectItem={handleSelectFlight}
          onSelectAll={handleSelectAll}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageClick}
          onEdit={handleEdit}
          containerClassName='flight'
        />

        <AddFlightModal open={addFlightOpen} onClose={() => setAddFlightOpen(false)} onAddSuccess={fetchFlights} />
        <EditFlightModal open={editFlightOpen} onClose={() => setEditFlightOpen(false)} flight={selectedFlight} onEditSuccess={fetchFlights} />
        <DeleteModal
          open={deleteFlightOpen}
          onClose={() => setDeleteFlightOpen(false)}
          items={selectedFlights.map(id => flights.find(flight => flight.id === id)).filter(flight => flight)}
          onDeleteSuccess={fetchFlights}
          endpoint="/Flights/delete-bulk"
          title="Delete Flights"
          message="Are you sure you want to delete the selected flights?"
        />
      </div>
    </div>
  );
};

export default FlightsPage;