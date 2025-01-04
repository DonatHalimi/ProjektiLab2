import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { updateHotel } from '../../../services/hotelService';
import { AddChipButton, BlueButton, CustomBox, CustomModal, CustomTypography, OutlinedBlueButton, StyledChip, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import { TextField } from '@mui/material';
import { Upload } from '@mui/icons-material';

const EditHotelModal = ({ open, onClose, hotel, onEditSuccess }) => {
  const [hotelData, setHotelData] = useState({
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

  useEffect(() => {
    if (hotel) {
      setHotelData({
        name: hotel.name || '',
        location: hotel.location || '',
        capacity: hotel.capacity || '',
        amenities: hotel.amenities || [],
        roomTypes: hotel.roomTypes || [],
        image: null,
      });
      setImagePreview(hotel.image ? `data:image/png;base64,${hotel.image}` : null);
    }
  }, [hotel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHotelData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddAmenity = () => {
    if (amenity.trim()) {
      setHotelData((prev) => ({ ...prev, amenities: [...prev.amenities, amenity] }));
      setAmenity('');
    }
  };

  const handleAddRoomType = () => {
    if (roomType.trim()) {
      setHotelData((prev) => ({ ...prev, roomTypes: [...prev.roomTypes, roomType] }));
      setRoomType('');
    }
  };

  const handleRemoveAmenity = (index) => {
    const updatedAmenities = hotelData.amenities.filter((_, i) => i !== index);
    setHotelData((prev) => ({ ...prev, amenities: updatedAmenities }));
  };

  const handleRemoveRoomType = (index) => {
    const updatedRoomTypes = hotelData.roomTypes.filter((_, i) => i !== index);
    setHotelData((prev) => ({ ...prev, roomTypes: updatedRoomTypes }));
  };

  const base64ToFile = async (base64String) => {
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    const binaryString = atob(base64Data);
    const byteArray = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    return new File([blob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });
  };

  const handleEditHotel = async () => {
    const { name, location, capacity, amenities, roomTypes, image } = hotelData;

    if (!name || !location || !capacity || !amenities.length || !roomTypes.length) {
      toast.error('Please fill in all the fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('HotelID', hotel.id);
      formData.append('Name', name);
      formData.append('Location', location);
      formData.append('Capacity', capacity);
      amenities.forEach((item) => formData.append('Amenities', item));
      roomTypes.forEach((item) => formData.append('RoomTypes', item));

      if (image) {
        // New image uploaded
        formData.append('Image', image);
      } else if (hotel.image) {
        // Convert existing base64 image to file and append
        const file = await base64ToFile(hotel.image);
        formData.append('Image', file);
      } else {
        toast.error('An image is required');
        return;
      }

      const response = await updateHotel(hotel.id, formData);
      toast.success('Hotel updated successfully');
      onEditSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating hotel:', error);
      const errorMessage = error.response?.data?.errors?.Image?.[0] || 'Error updating hotel';
      toast.error(errorMessage);
    }
  };

  return (
    <CustomModal open={open} onClose={onClose}>
      <CustomBox>
        <CustomTypography variant="h5">Edit Hotel</CustomTypography>

        <TextField
          fullWidth
          required
          label="Hotel Name"
          name="name"
          value={hotelData.name}
          onChange={handleChange}
          className="!mb-4"
        />
        <TextField
          fullWidth
          required
          label="Location"
          name="location"
          value={hotelData.location}
          onChange={handleChange}
          className="!mb-4"
        />
        <TextField
          fullWidth
          required
          label="Capacity"
          name="capacity"
          type="number"
          value={hotelData.capacity}
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
            {hotelData.amenities.map((item, index) => (
              <StyledChip key={index} label={item} onDelete={() => handleRemoveAmenity(index)} />
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
            {hotelData.roomTypes.map((item, index) => (
              <StyledChip key={index} label={item} onDelete={() => handleRemoveRoomType(index)} />
            ))}
          </div>
        </div>

        <OutlinedBlueButton
          component="label"
          variant="contained"
          startIcon={<Upload />}
          className="w-full !mb-3"
        >
          Upload Image
          <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageChange} />
        </OutlinedBlueButton>

        {imagePreview && (
          <div className="mb-3">
            <img src={imagePreview} alt="Preview" className="max-w-full h-auto mx-auto rounded-md" />
          </div>
        )}

        <BlueButton
          onClick={handleEditHotel}
          variant="contained"
          color="primary"
          className="w-full"
        >
          Save Changes
        </BlueButton>
      </CustomBox>
    </CustomModal>
  );
};

export default EditHotelModal;