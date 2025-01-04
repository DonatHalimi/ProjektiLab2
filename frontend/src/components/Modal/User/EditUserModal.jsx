import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { getRoles } from '../../../services/roleService';
import { editUser } from '../../../services/userService';

const EditUserModal = ({ open, onClose, user, onEditSuccess }) => {
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        isValidEmail: true,
        role: '',
        roles: [],
    });

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRoles();
                setUserDetails((prev) => ({ ...prev, roles: response.data }));
            } catch (error) {
                console.error('Error fetching roles', error);
                toast.error('Failed to fetch roles');
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        if (user) {
            setUserDetails({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password, // temporary fix
                isValidEmail: true,
                role: user.role.id || user.roleId,
                roles: userDetails.roles,
            });
        }
    }, [user, userDetails.roles]);

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditUser = async () => {
        const { firstName, lastName, email, password, role } = userDetails;

        if (!firstName || !lastName || !email || !role) {
            toast.error('Please fill in all the fields');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Email format is not correct.');
            return;
        }

        const updatedData = {
            id: user.id,
            firstName,
            lastName,
            email,
            roleId: role,
        };

        if (password) {
            updatedData.password = password;
        }

        try {
            const response = await editUser(user.id, updatedData);
            toast.success('User updated successfully!');
            onEditSuccess(response);
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user. Please try again.');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit User</CustomTypography>

                <TextField
                    label="First Name"
                    value={userDetails.firstName}
                    onChange={handleChange}
                    fullWidth
                    name="firstName"
                    className="!mb-4"
                />
                <TextField
                    label="Last Name"
                    value={userDetails.lastName}
                    onChange={handleChange}
                    fullWidth
                    name="lastName"
                    className="!mb-4"
                />
                <TextField
                    label="Email"
                    value={userDetails.email}
                    onChange={(e) => {
                        setUserDetails((prev) => ({
                            ...prev,
                            email: e.target.value,
                            isValidEmail: validateEmail(e.target.value),
                        }));
                    }}
                    fullWidth
                    name="email"
                    type="email"
                    className="!mb-4"
                    error={!userDetails.isValidEmail}
                    helperText={!userDetails.isValidEmail ? 'Please enter a valid email address' : ''}
                />
                <TextField
                    label="Password"
                    value={userDetails.password}
                    onChange={handleChange}
                    fullWidth
                    name="password"
                    placeholder="Leave blank to keep current password"
                    type="password"
                    className="!mb-4"
                />
                <FormControl fullWidth className="!mb-4">
                    <InputLabel>Role</InputLabel>
                    <Select
                        label="Role"
                        value={userDetails.role}
                        onChange={handleChange}
                        name="role"
                    >
                        {userDetails.roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <BlueButton
                    onClick={handleEditUser}
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

export default EditUserModal;