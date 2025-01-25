import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { updateFAQ } from '../../../services/faqService';

const EditFAQModal = ({ open, onClose, faq, onEditSuccess }) => {
    const [formData, setFormData] = useState({
        question: '',
        answer: ''
    });

    useEffect(() => {
        if (faq) {
            setFormData({
                question: faq.question,
                answer: faq.answer
            });
        }
    }, [faq]);

    const handleEditFaq = async (e) => {
        e.preventDefault();
        try {
            await updateFAQ(faq._id, formData);
            toast.success('FAQ updated successfully');
            onEditSuccess();
            onClose();
        } catch (error) {
            toast.error('Error updating FAQ');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit FAQ</CustomTypography>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Question"
                    type="text"
                    fullWidth
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    required
                />
                <TextField
                    margin="dense"
                    label="Answer"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    required
                />

                <BlueButton
                    onClick={handleEditFaq}
                    variant="contained"
                    color="primary"
                    className="!mt-4 w-full"
                >
                    Save
                </BlueButton>
            </CustomBox>
        </CustomModal>

    );
};

export default EditFAQModal; 