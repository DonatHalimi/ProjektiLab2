import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import axiosInstance from '../../../utils/axiosInstance';

const AddContactModal = ({ open, onClose, onAddSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const isValidPhoneNumber = (v) => /^0(44|45|48|49)\d{6}$/.test(v);

    const handleAddContact = async (e) => {
        if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
            toast.error('Please fill in all the fields');
            return;
        }

        if (!isValidPhoneNumber(formData.phone)) {
            toast.error('Phone number must start with 044, 045, 048 or 049 followed by 6 digits');
            return;
        }

        try {
            await axiosInstance.post('/Contact', formData);
            toast.success('Contact created successfully');
            onAddSuccess();
            onClose();
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error('Error creating contact');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Contact</CustomTypography>

                <TextField
                    fullWidth
                    required
                    label="Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className='!mb-4'
                />
                <TextField
                    fullWidth
                    required
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className='!mb-4'
                />
                <TextField
                    fullWidth
                    required
                    label="Phone"
                    type="tel"
                    placeholder="044/45/48 XXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className='!mb-4'
                />
                <TextField
                    fullWidth
                    required
                    label="Subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className='!mb-4'
                />
                <TextField
                    fullWidth
                    required
                    label="Message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className='!mb-4'
                />

                <BlueButton
                    onClick={handleAddContact}
                    variant="contained"
                    color="primary"
                    className="!mt-4 w-full"
                >
                    Add
                </BlueButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddContactModal; 