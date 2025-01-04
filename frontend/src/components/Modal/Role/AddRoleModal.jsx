import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { createRole } from '../../../services/roleService';

const AddRoleModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');

    const handleAddRole = async () => {
        if (!name) {
            toast.error('Please fill in the role name');
            return;
        }

        const data = {
            name
        };

        try {
            const response = await createRole(data);
            toast.success(response.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error('You do not have permission to perform this action');
            } else {
                toast.error('Error adding role');
            }
            console.error('Error adding role', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Role</CustomTypography>

                <TextField
                    fullWidth
                    required
                    label="Role Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="!mb-4"
                />
                <BlueButton
                    onClick={handleAddRole}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Add
                </BlueButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddRoleModal;