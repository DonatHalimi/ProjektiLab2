import { Upload } from '@mui/icons-material';
import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { AddChipButton, BlueButton, CustomBox, CustomModal, CustomTypography, OutlinedBlueButton, StyledChip, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import { createHotel } from '../../../services/hotelService';

const AddHotelModal = ({ open, onClose, onAddSuccess }) => {
  const [hotel, setHotel] = useState({
    name: '',
    location: '',
    capacity: '',
    amenities: [],
    roomTypes: [],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [amenity, setAmenity] = useState('');
  const [roomType, setRoomType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amenities' || name === 'roomTypes') {
      const values = value.split(',').map((item) => item.trim());
      setHotel((prev) => ({ ...prev, [name]: values }));
    } else {
      setHotel((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHotel((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddAmenity = () => {
    if (amenity.trim()) {
      setHotel((prev) => ({ ...prev, amenities: [...prev.amenities, amenity] }));
      setAmenity('');
    }
  };

  const handleAddRoomType = () => {
    if (roomType.trim()) {
      setHotel((prev) => ({ ...prev, roomTypes: [...prev.roomTypes, roomType] }));
      setRoomType('');
    }
  };

  const handleRemoveAmenity = (index) => {
    const newAmenities = hotel.amenities.filter((_, i) => i !== index);
    setHotel((prev) => ({ ...prev, amenities: newAmenities }));
  };

  const handleRemoveRoomType = (index) => {
    const newRoomTypes = hotel.roomTypes.filter((_, i) => i !== index);
    setHotel((prev) => ({ ...prev, roomTypes: newRoomTypes }));
  };

  const handleAddHotel = async () => {
    const { name, location, capacity, amenities, roomTypes, image } = hotel;

    if (!name || !location || !capacity || !amenities.length || !roomTypes.length || !image) {
      toast.error('Please fill in all the fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('capacity', capacity);

    amenities.forEach((amenity) => formData.append('amenities', amenity));
    roomTypes.forEach((roomType) => formData.append('roomTypes', roomType));

    formData.append('image', image);

    try {
      const response = await createHotel(formData);
      toast.success('Hotel added successfully');
      onAddSuccess(response.data);
      onClose();
    } catch (error) {
      toast.error('Error adding hotel');
      console.error('Error adding hotel:', error);
    }
  };

  return (
    <CustomModal open={open} onClose={onClose}>
      <CustomBox>
        <CustomTypography variant="h5">Add Hotel</CustomTypography>

        <TextField
          fullWidth
          required
          label="Hotel Name"
          name="name"
          value={hotel.name}
          onChange={handleChange}
          className="!mb-4"
        />
        <TextField
          fullWidth
          required
          label="Location"
          name="location"
          value={hotel.location}
          onChange={handleChange}
          className="!mb-4"
        />
        <TextField
          fullWidth
          required
          label="Capacity"
          name="capacity"
          type="number"
          value={hotel.capacity}
          onChange={handleChange}
          className="!mb-4"
        />

        <div className="!mb-2">
          <div className="flex items-center gap-2">
            <TextField
              fullWidth
              label="Add Amenity"
              value={amenity}
              onChange={(e) => setAmenity(e.target.value)}
              className="!mb-2"
            />
            <AddChipButton onClick={handleAddAmenity} disabled={!amenity.trim()} />
          </div>
          <div className="flex flex-wrap mt-2">
            {hotel.amenities.map((item, index) => (
              <StyledChip
                key={index}
                label={item}
                onDelete={() => handleRemoveAmenity(index)}
              />
            ))}
          </div>
        </div>

        <div className="!mb-2">
          <div className="flex items-center gap-2">
            <TextField
              fullWidth
              label="Add Room Type"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="!mb-2"
            />
            <AddChipButton onClick={handleAddRoomType} disabled={!roomType.trim()} />
          </div>

          <div className="flex flex-wrap mt-2">
            {hotel.roomTypes.map((item, index) => (
              <StyledChip
                key={index}
                label={item}
                onDelete={() => handleRemoveRoomType(index)}
              />
            ))}
          </div>
        </div>

        <OutlinedBlueButton
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<Upload />}
          className="w-full !mb-3"
        >
          Upload Image
          <VisuallyHiddenInput type="file" onChange={handleImageChange} />
        </OutlinedBlueButton>

        {imagePreview && (
          <div className="mb-3">
            <img src={imagePreview} alt="Preview" className="max-w-full h-auto mx-auto rounded-md" />
          </div>
        )}

        <BlueButton
          onClick={handleAddHotel}
          variant="contained"
          color="primary"
          className="w-full"
        >
          Add Hotel
        </BlueButton>
      </CustomBox>
    </CustomModal>
  );
};

export default AddHotelModal;