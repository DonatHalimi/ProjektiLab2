import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BlueButton, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import { getRoles } from '../../../services/roleService';
import { createUser } from '../../../services/userService';

const AddUserModal = ({ open, onClose, onAddSuccess }) => {
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        showPassword: false,
        role: '',
    });

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRoles();
                setRoles(response.data);

                const userRole = response.data.find(role => role.name.toLowerCase() === 'user'); // pre-fill 'user' role
                if (userRole) {
                    setUserDetails((prev) => ({ ...prev, role: userRole.id }));
                }
            } catch (error) {
                console.error('Error fetching roles', error);
            }
        };
        fetchRoles();
    }, []);

    const handleClickShowPassword = () => setUserDetails((prev) => ({ ...prev, showPassword: !prev.showPassword }));
    const handleMouseDownPassword = () => setUserDetails((prev) => ({ ...prev, showPassword: !prev.showPassword }));

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddUser = async () => {
        const { firstName, lastName, email, password, role } = userDetails;

        if (!firstName || !lastName || !email || !password || !role) {
            toast.error('Please fill in all the fields');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Email format is not correct.');
            return;
        }

        if (!validatePassword(password)) {
            toast.error(
                'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
            );
            return;
        }

        const data = {
            firstName,
            lastName,
            email,
            password,
            roleId: role,
            flightPurchases: [],
            tourPurchases: [],
        };

        try {
            const response = await createUser(data);
            toast.success(response.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            console.error('Error adding user:', error);
            const errorMessage = error.response?.data?.errors
                ? Object.entries(error.response.data.errors)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('\n')
                : 'Error adding user';
            toast.error(errorMessage);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add User</CustomTypography>

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
                    onChange={handleChange}
                    fullWidth
                    name="email"
                    type="email"
                    className='!mb-4'
                />
                <TextField
                    label="Password"
                    value={userDetails.password}
                    onChange={handleChange}
                    fullWidth
                    name="password"
                    type={userDetails.showPassword ? "text" : "password"}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {userDetails.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
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
                        {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <BlueButton
                    onClick={handleAddUser}
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

export default AddUserModal;