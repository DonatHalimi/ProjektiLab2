import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { editRole } from '../../../services/roleService';

const EditRoleModal = ({ open, onClose, role, onEditSuccess }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (role) {
            setName(role.name);
        }
    }, [role]);

    const handleEditRole = async () => {
        if (!name) {
            toast.error('Please fill in the role name', { closeOnClick: true });
            return;
        }

        const updatedData = {
            id: role.id,
            name
        };

        try {
            const response = await editRole(role.id, updatedData);
            toast.success(response.message);
            onEditSuccess(response);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error('You do not have permission to perform this action');
            } else {
                toast.error('Error updating role');
            }
            console.error('Error updating role', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Role</CustomTypography>

                <TextField
                    fullWidth
                    required
                    label="Role Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="!mb-4"
                />

                <BlueButton
                    onClick={handleEditRole}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save
                </BlueButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditRoleModal;