import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { createFAQ } from '../../../services/faqService';

const AddFAQModal = ({ open, onClose, onAddSuccess }) => {
    const [formData, setFormData] = useState({
        question: '',
        answer: ''
    });

    const handleAddFaq = async (e) => {
        if (!formData.question || !formData.answer) {
            toast.error('Please fill in all the fields');
            return;
        }

        try {
            await createFAQ(formData);
            toast.success('FAQ created successfully');
            onAddSuccess();
            onClose();
            setFormData({ question: '', answer: '' });
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error('You do not have permission to perform this action');
            } else {
                toast.error('Error adding FAQ');
            }
            toast.error('Error creating FAQ');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add FAQ</CustomTypography>

                <TextField
                    fullWidth
                    required
                    label="Question"
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className='!mb-4'
                />
                <TextField
                    fullWidth
                    required
                    label="Answer"
                    multiline
                    rows={4}
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                />

                <BlueButton
                    onClick={handleAddFaq}
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

export default AddFAQModal; 