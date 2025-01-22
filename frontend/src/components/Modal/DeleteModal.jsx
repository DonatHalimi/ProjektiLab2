import React from 'react';
import { toast } from 'react-toastify';
import { CustomDeleteModal } from '../../assets/CustomComponents';
import axiosInstance from '../../utils/axiosInstance';

const DeleteModal = ({ open, onClose, items, onDeleteSuccess, endpoint, title, message }) => {

    const handleDelete = async () => {
        const idsToDelete = items.map(item => item.id).filter(id => id);

        try {
            await axiosInstance.delete(endpoint, { data: { ids: idsToDelete } });

            const itemType = title.replace('Delete', '').trim();
            toast.success(`${itemType} deleted successfully`);
            onDeleteSuccess();
            onClose();
        } catch (error) {
            const itemType = title.replace('Delete', '').trim();
            const errorMessage = error.response?.data?.message || `Error deleting ${itemType}`;
            toast.error(errorMessage);

            console.error(`Error deleting ${itemType}`, error);
        }
    };

    return (
        <CustomDeleteModal
            open={open}
            onClose={onClose}
            title={title}
            message={message}
            onDelete={handleDelete}
        />
    );
};

export default DeleteModal;