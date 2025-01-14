import React, { useEffect, useState } from 'react';
import { DashboardHeader, formatDate, ImagePreviewModal, LoadingDataGrid } from '../../assets/CustomComponents.jsx';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal.jsx';
import AddRoomModal from '../../components/Modal/Room/AddRoomModal.jsx';
import EditRoomModal from '../../components/Modal/Room/EditRoomModal.jsx';
import { getRooms } from '../../services/roomService.js';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [editRoomOpen, setEditRoomOpen] = useState(false);
  const [deleteRoomOpen, setDeleteRoomOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSelectRoom = (roomId) => {
    const id = Array.isArray(roomId) ? roomId[0] : roomId;

    setSelectedRooms((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (e) => {
    setSelectedRooms(e.target.checked ? rooms.map((room) => room.id) : []);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setEditRoomOpen(true);
  };

  const handleImageClick = (images) => {
    setImageUrls(images);
    setImagePreviewOpen(true);
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (row) => {
        if (row.images && row.images.length > 0) {
          return (
            <img
              src={row.images[0]} // show first image (click image to open imagepreviewmodal -> all images slider)
              alt="Room"
              onClick={() => handleImageClick(row.images)}
              className="w-14 h-14 object-cover rounded-md room-image cursor-pointer"
            />
          );
        } else {
          return (
            <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              No Image
            </div>
          );
        }
      },
    },
    { key: 'hotelName', label: 'Hotel Name' },
    { key: 'hotelLocation', label: 'Hotel Location' },
    { key: 'roomType', label: 'Room Type' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'price', label: 'Price', render: (row) => `€ ${row.price}` },
    { key: 'createdAt', label: 'Created At', render: (row) => formatDate(row.createdAt) },
    { key: 'updatedAt', label: 'Updated At', render: (row) => formatDate(row.updatedAt) },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <>
      <div className="container mx-auto max-w-screen-2xl px-4 mt-20">
        <div className="flex flex-col items-center justify-center">
          {loading ? (
            <LoadingDataGrid />
          ) : (
            <>
              <DashboardHeader
                title="Rooms"
                selectedItems={selectedRooms}
                setAddItemOpen={setAddRoomOpen}
                setDeleteItemOpen={setDeleteRoomOpen}
                itemName="Room"
              />

              <DashboardTable
                columns={columns}
                data={rooms}
                selectedItems={selectedRooms}
                onSelectItem={handleSelectRoom}
                onSelectAll={handleSelectAll}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageClick}
                onEdit={handleEdit}
              />
            </>
          )}

          <AddRoomModal open={addRoomOpen} onClose={() => setAddRoomOpen(false)} onAddSuccess={fetchRooms} />
          <EditRoomModal open={editRoomOpen} onClose={() => setEditRoomOpen(false)} room={selectedRoom} onEditSuccess={fetchRooms} />
          <DeleteModal
            open={deleteRoomOpen}
            onClose={() => setDeleteRoomOpen(false)}
            items={selectedRooms.map((id) => rooms.find((room) => room.id === id)).filter((room) => room)}
            onDeleteSuccess={() => {
              fetchRooms()
              setSelectedRooms([]);
            }}
            endpoint="/rooms/delete-bulk"
            title="Delete Rooms"
            message="Are you sure you want to delete the selected rooms?"
          />
        </div>
      </div >

      <ImagePreviewModal
        open={imagePreviewOpen}
        onClose={() => setImagePreviewOpen(false)}
        imageUrls={imageUrls}
      />
    </>
  );
};

export default RoomsPage;