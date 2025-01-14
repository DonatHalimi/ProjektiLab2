import React, { useEffect, useState } from 'react';
import { DashboardHeader, formatDate, ImagePreviewModal, LoadingDataGrid } from '../../assets/CustomComponents.jsx';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal.jsx';
import AddHotelModal from '../../components/Modal/Hotel/AddHotelModal.jsx';
import EditHotelModal from '../../components/Modal/Hotel/EditHotelModal.jsx';
import { getHotels } from '../../services/hotelService.js';

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [addHotelOpen, setAddHotelOpen] = useState(false);
  const [editHotelOpen, setEditHotelOpen] = useState(false);
  const [deleteHotelOpen, setDeleteHotelOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await getHotels();
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSelectHotel = (hotelId) => {
    const id = Array.isArray(hotelId) ? hotelId[0] : hotelId;

    setSelectedHotels((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (e) => {
    setSelectedHotels(e.target.checked ? hotels.map(hotel => hotel.HotelID) : []);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleEdit = (hotel) => {
    setSelectedHotel(hotel);
    setEditHotelOpen(true);
  };

  const handleImageClick = (imageUrl) => {
    setImagePreviewUrl([imageUrl]);
    setImagePreviewOpen(true);
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (row) => row.image ? (
        <img
          src={`data:image/jpeg;base64,${row.image}`}
          alt="Hotel"
          className="w-14 h-14 object-cover rounded-md hotel-image cursor-pointer"
          onClick={() => handleImageClick(`data:image/jpeg;base64,${row.image}`)}
        />
      ) : (
        <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
          No Image
        </div>
      )
    },
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'amenities', label: 'Amenities' },
    { key: 'roomTypes', label: 'Room Types' },
    { key: 'createdAt', label: 'Created At', render: (row) => formatDate(row.createdAt) },
    { key: 'updatedAt', label: 'Updated At', render: (row) => formatDate(row.updatedAt) },
    { key: 'actions', label: 'Actions' }
  ];

  return (
    <>
      <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
        <div className='flex flex-col items-center justify-center'>
          {loading ? (
            <LoadingDataGrid />
          ) : (
            <>
              <DashboardHeader
                title="Hotels"
                selectedItems={selectedHotels}
                setAddItemOpen={setAddHotelOpen}
                setDeleteItemOpen={setDeleteHotelOpen}
                itemName="Hotel"
              />

              <DashboardTable
                columns={columns}
                data={hotels}
                selectedItems={selectedHotels}
                onSelectItem={handleSelectHotel}
                onSelectAll={handleSelectAll}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageClick}
                onEdit={handleEdit}
              />
            </>
          )}

          <AddHotelModal open={addHotelOpen} onClose={() => setAddHotelOpen(false)} onAddSuccess={fetchHotels} />
          <EditHotelModal open={editHotelOpen} onClose={() => setEditHotelOpen(false)} hotel={selectedHotel} onEditSuccess={fetchHotels} />
          <DeleteModal
            open={deleteHotelOpen}
            onClose={() => setDeleteHotelOpen(false)}
            items={selectedHotels.map(id => hotels.find(hotel => hotel.id === id)).filter(hotel => hotel)}
            onDeleteSuccess={() => {
              fetchHotels()
              setSelectedHotels([]);
            }}
            endpoint="/hotels/delete-bulk"
            title="Delete Hotels"
            message="Are you sure you want to delete the selected hotels?"
          />
        </div>
      </div>

      <ImagePreviewModal
        open={imagePreviewOpen}
        onClose={() => setImagePreviewOpen(false)}
        imageUrls={imagePreviewUrl}
      />
    </>
  );
};

export default HotelsPage;