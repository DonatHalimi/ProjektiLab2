import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, IconButton, InputAdornment } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BlueButton, BlueTextField, downloadUserData, Header, knownEmailProviders, LoadingInformation, ProfileLayout } from '../../assets/CustomComponents';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { getCurrentUser } from '../../services/authService';
import axiosInstance from '../../utils/axiosInstance';

const ProfileInformation = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [initialData, setInitialData] = useState({ firstName: '', lastName: '', email: '' });
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);

    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response);
                setInitialData({
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: response.email,
                });
                setFirstName(response.firstName);
                setLastName(response.lastName);
                setEmail(response.email);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const validateFirstName = (name) => /^[A-Z][a-zA-Z]{1,9}$/.test(name);
    const validateLastName = (name) => /^[A-Z][a-zA-Z]{1,9}$/.test(name);

    const validateEmail = (email) => {
        const regex = new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i');
        return regex.test(email);
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setFirstName(value);
        setFirstNameValid(validateFirstName(value));
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value;
        setLastName(value);
        setLastNameValid(validateLastName(value));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailValid(validateEmail(value));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
    };

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            firstName: firstName !== initialData.firstName ? firstName : undefined,
            lastName: lastName !== initialData.lastName ? lastName : undefined,
            email: email !== initialData.email ? email : undefined,
            newPassword: newPassword || undefined,
            currentPassword: password || undefined,
        };

        const filteredData = Object.fromEntries(
            Object.entries(updatedData).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(filteredData).length === 0) {
            toast.info('No changes detected');
            return;
        }

        try {
            const userId = user?.id;
            const response = await axiosInstance.put(`/users/update-info/${userId}`, filteredData);

            if (response.data.success) {
                toast.success('Profile updated successfully!');

                // Generate new token on email change
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                }

                // Re-fetch the current user's data
                const userResponse = await axiosInstance.get('/auth/me');
                setUser(userResponse.data);

                window.location.reload();
            } else {
                toast.error(response.data.error || 'Profile update failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);

            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        toast.error(data?.message || 'Bad Request');
                        break;
                    case 401:
                        toast.error(data?.message || 'Invalid current password');
                        break;
                    case 409:
                        toast.error(data?.message || 'Email already in use');
                        break;
                    default:
                        toast.error(data?.message || 'An unexpected error occurred');
                }
            } else if (error.request) {
                toast.error('No response from the server. Please try again later.');
            } else {
                toast.error('Error occurred while updating profile');
            }
        }
    };

    const isFormValid = firstNameValid && lastNameValid && emailValid && password;

    const isFormUnchanged = (
        firstName === initialData.firstName &&
        lastName === initialData.lastName &&
        email === initialData.email &&
        !newPassword &&
        !password
    );

    const handleDownloadUserData = () => {
        if (user) {
            downloadUserData(user);
        }
    };

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header
                    title="Profile Information"
                    isUserData={true}
                    onDownloadUserData={handleDownloadUserData}
                />

                <Box className='bg-white rounded-md shadow-sm mb-24'
                    sx={{
                        p: { xs: 3, md: 3 }
                    }}
                >
                    {loading ? (
                        <LoadingInformation />
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-1">
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 2 } }}>
                                <div className="relative flex-grow">
                                    <BlueTextField
                                        fullWidth
                                        label="First Name"
                                        variant="outlined"
                                        name="firstName"
                                        value={firstName}
                                        onChange={handleFirstNameChange}
                                        onFocus={() => setFocusedField('firstName')}
                                        onBlur={() => setFocusedField(null)}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                    {focusedField === 'firstName' && !firstNameValid && (
                                        <div className="absolute left-0 bottom-[-78px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                            <span className="block text-xs font-semibold mb-1">Invalid First Name</span>
                                            Must start with a capital letter and be 2 to 10 characters long.
                                            <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative flex-grow">
                                    <BlueTextField
                                        fullWidth
                                        label="Last Name"
                                        variant="outlined"
                                        name="lastName"
                                        value={lastName}
                                        onChange={handleLastNameChange}
                                        onFocus={() => setFocusedField('lastName')}
                                        onBlur={() => setFocusedField(null)}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                    {focusedField === 'lastName' && !lastNameValid && (
                                        <div className="absolute left-0 bottom-[-78px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                            <span className="block text-xs font-semibold mb-1">Invalid Last Name</span>
                                            Must start with a capital letter and be 2 to 10 characters long.
                                            <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative flex-grow">
                                    <BlueTextField
                                        fullWidth
                                        label="Email"
                                        variant="outlined"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                    {focusedField === 'email' && !emailValid && (
                                        <div className="absolute left-0 bottom-[-58px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                            <span className="block text-xs font-semibold mb-1">Invalid Email</span>
                                            Please provide a valid email address.
                                            <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                        </div>
                                    )}
                                </div>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 0, md: 2 } }}>
                                <div className="relative flex-grow">
                                    <BlueTextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Current Password"
                                        placeholder='Required to save changes'
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle current password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityIcon className="text-gray-500" /> : <VisibilityOffIcon className="text-gray-500" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>

                                <div className="relative flex-grow">
                                    <BlueTextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        name="newPassword"
                                        label="New Password"
                                        placeholder='Leave blank to keep current password'
                                        type={showNewPassword ? 'text' : 'password'}
                                        id="new-password"
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        onFocus={() => setFocusedField('newPassword')}
                                        onBlur={() => setFocusedField(null)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle new password visibility"
                                                        onClick={handleClickShowNewPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showNewPassword ? <VisibilityIcon className="text-gray-500" /> : <VisibilityOffIcon className="text-gray-500" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>
                            </Box>

                            <BlueButton
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isFormUnchanged || !isFormValid}
                            >
                                Update
                            </BlueButton>
                        </form>
                    )}
                </Box>
            </ProfileLayout>

            <Footer />
        </>
    );
};

export default ProfileInformation;