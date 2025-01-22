import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { updateFAQ } from '../../../services/faqService';
import { toast } from 'react-toastify';

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

    const handleSubmit = async (e) => {
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit FAQ</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">Update FAQ</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditFAQModal; 