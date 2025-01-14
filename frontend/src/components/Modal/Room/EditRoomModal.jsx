import { Delete, Upload } from '@mui/icons-material';
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography, DeleteImageModal, OutlinedBlueButton, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import { getHotels } from '../../../services/hotelService';
import { deleteImageFromRoom, updateRoom } from '../../../services/roomService';

const EditRoomModal = ({ open, onClose, room, onEditSuccess }) => {
  const [roomData, setRoomData] = useState({
    hotelId: '',
    roomType: '',
    capacity: '',
    price: '',
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getHotels();
        setHotels(response.data);
      } catch (error) {
        toast.error('Error fetching hotels');
        console.error('Error fetching hotels:', error);
      }
    };

    if (open) {
      fetchHotels();
    }

    if (room) {
      setRoomData({
        hotelId: room.hotelID || '',
        roomType: room.roomType || '',
        capacity: room.capacity || '',
        price: room.price || '',
        images: room.images || [],
      });

      if (room.images) {
        setImagePreviews(room.images);
      }
    }
  }, [open, room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileUrls = files.map((file) => URL.createObjectURL(file));

    setRoomData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setImagePreviews((prev) => [...prev, ...fileUrls]);
  };

  const handleRemoveImage = (index, imageUrl) => {
    setImageToDelete({ index, imageUrl });
  };

  const confirmDeleteImage = async (imageUrl) => {
    const { index } = imageToDelete;

    try {
      const imageName = imageUrl.split('/').pop().split('.')[0];

      // Check if the image URL is an existing file in the backend
      if (imageUrl.startsWith("https://localhost")) {
        const response = await deleteImageFromRoom(imageName);

        const newImages = roomData.images.filter((_, i) => i !== index);
        const newImagePreviews = imagePreviews.filter((_, i) => i !== index);

        setRoomData((prev) => ({ ...prev, images: newImages }));
        setImagePreviews(newImagePreviews);

        toast.success(response.data.message);
      } else {
        // If it's not a hosted image, remove the image locally from the previews
        const newImages = roomData.images.filter((_, i) => i !== index);
        const newImagePreviews = imagePreviews.filter((_, i) => i !== index);

        setRoomData((prev) => ({ ...prev, images: newImages }));
        setImagePreviews(newImagePreviews);
      }
    } catch (error) {
      toast.error('Error removing image');
      console.error('Error removing image:', error);
    }

    setImageToDelete(null);
  };

  const handleEditRoom = async () => {
    const { hotelId, roomType, capacity, price, images } = roomData;

    if (!hotelId || !roomType || !capacity || !price || !images.length) {
      toast.error('Please fill in all the fields');
      return;
    }

    const formData = new FormData();
    formData.append('hotelId', hotelId);
    formData.append('roomType', roomType);
    formData.append('capacity', capacity);
    formData.append('price', price);

    images.forEach((image) => formData.append('images', image));

    try {
      const response = await updateRoom(room.id, formData);
      toast.success('Room updated successfully');
      onEditSuccess(response.data);
      onClose();
    } catch (error) {
      toast.error('Error updating room');
      console.error('Error updating room:', error);
    }
  };

  return (
    <CustomModal open={open} onClose={onClose}>
      <CustomBox>
        <CustomTypography variant="h5">Edit Room</CustomTypography>

        <FormControl fullWidth className="!mb-4">
          <InputLabel>Hotel</InputLabel>
          <Select
            value={roomData.hotelId}
            onChange={handleChange}
            label="Hotel"
            name="hotelId"
            required
          >
            {hotels.map((hotel) => (
              <MenuItem key={hotel.id} value={hotel.id}>
                {hotel.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          required
          label="Room Type"
          name="roomType"
          value={roomData.roomType}
          onChange={handleChange}
          className="!mb-4"
        />
        <TextField
          fullWidth
          required
          label="Capacity"
          name="capacity"
          type="number"
          value={roomData.capacity}
          onChange={handleChange}
          className="!mb-4"
        />
        <TextField
          fullWidth
          required
          label="Price"
          name="price"
          type="number"
          value={roomData.price}
          onChange={handleChange}
          className="!mb-4"
        />

        <OutlinedBlueButton
          component="label"
          variant="contained"
          startIcon={<Upload />}
          className="w-full !mb-3"
        >
          Upload Images
          <VisuallyHiddenInput type="file" multiple onChange={handleImageChange} />
        </OutlinedBlueButton>

        <div className="ml-10 mt-1 flex flex-wrap gap-4">
          {imagePreviews.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Preview ${index}`}
                className="max-w-[100px] h-auto mx-auto rounded-md"
              />
              <div className="flex justify-center mt-2 mb-2">
                <IconButton
                  onClick={() => handleRemoveImage(index, image)}
                  className="absolute top-0 right-0"
                >
                  <Delete />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        <BlueButton
          onClick={handleEditRoom}
          variant="contained"
          color="primary"
          className="w-full"
        >
          Save Changes
        </BlueButton>

        <DeleteImageModal
          open={!!imageToDelete}
          onClose={() => setImageToDelete(null)}
          onDelete={confirmDeleteImage}
          imageUrl={imageToDelete ? imageToDelete.imageUrl : ''}
        />
      </CustomBox>
    </CustomModal>
  );
};

export default EditRoomModal;