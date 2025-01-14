import { Delete, Upload } from '@mui/icons-material';
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography, OutlinedBlueButton, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import { getHotels } from '../../../services/hotelService';
import { createRoom } from '../../../services/roomService';

const AddRoomModal = ({ open, onClose, onAddSuccess }) => {
  const [room, setRoom] = useState({
    hotelId: '',
    roomType: '',
    capacity: '',
    price: '',
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [hotels, setHotels] = useState([]);

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
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileUrls = files.map((file) => URL.createObjectURL(file));

    setRoom((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setImagePreviews((prev) => [...prev, ...fileUrls]);
  };

  const handleRemoveImage = (index) => {
    const newImages = room.images.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);

    setRoom((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newImagePreviews);
  };

  const handleAddRoom = async () => {
    const { hotelId, roomType, capacity, price, images } = room;

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
      const response = await createRoom(formData);
      toast.success('Room added successfully');
      onAddSuccess(response.data);
      onClose();
    } catch (error) {
      toast.error('Error adding room');
      console.error('Error adding room:', error);
    }
  };

  return (
    <CustomModal open={open} onClose={onClose}>
      <CustomBox>
        <CustomTypography variant="h5">Add Room</CustomTypography>

        <FormControl fullWidth className="!mb-4">
          <InputLabel>Hotel</InputLabel>
          <Select
            value={room.hotelId}
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
          value={room.roomType}
          onChange={handleChange}
          className="!mb-4"
        />
        <TextField
          fullWidth
          required
          label="Capacity"
          name="capacity"
          type="number"
          value={room.capacity}
          onChange={handleChange}
          className="!mb-4"
        />
        <TextField
          fullWidth
          required
          label="Price"
          name="price"
          type="number"
          value={room.price}
          onChange={handleChange}
          className="!mb-4"
        />

        <OutlinedBlueButton
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<Upload />}
          className="w-full !mb-3"
        >
          Upload Images
          <VisuallyHiddenInput type="file" multiple onChange={handleImageChange} />
        </OutlinedBlueButton>

        <div className="ml-10 mt-1 flex flex-wrap gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index}`}
                className="max-w-[100px] h-auto mx-auto rounded-md"
              />
              <div className="flex justify-center mt-2 mb-2">
                <IconButton
                  className="absolute top-0 right-0"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Delete />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        <BlueButton
          onClick={handleAddRoom}
          variant="contained"
          color="primary"
          className="w-full"
        >
          Add Room
        </BlueButton>
      </CustomBox>
    </CustomModal>
  );
};

export default AddRoomModal;