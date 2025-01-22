import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { createFAQ } from '../../../services/faqService';
import { toast } from 'react-toastify';

const AddFAQModal = ({ open, onClose, onAddSuccess }) => {
    const [formData, setFormData] = useState({
        question: '',
        answer: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createFAQ(formData);
            toast.success('FAQ created successfully');
            onAddSuccess();
            onClose();
            setFormData({ question: '', answer: '' });
        } catch (error) {
            toast.error('Error creating FAQ');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New FAQ</DialogTitle>
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
                    <Button type="submit" variant="contained" color="primary">Add FAQ</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddFAQModal; 