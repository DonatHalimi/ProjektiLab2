import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { deleteBulkFAQs } from '../../services/faqService';

const DeleteModal = ({ open, onClose, items, onDelete, title, message }) => {
    const handleDelete = async () => {
        try {
            await onDelete();
        } catch (error) {
            console.error('Error in DeleteModal:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleDelete} color="error" variant="contained">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteModal;