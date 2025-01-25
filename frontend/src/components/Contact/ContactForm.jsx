import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../../services/authService';
import axiosInstance from '../../utils/axiosInstance';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const isValidPhoneNumber = (v) => /^0(44|45|48|49)\d{6}$/.test(v);

    const getUserDetails = async () => {
        try {
            const user = await getCurrentUser();
            setFormData((prev) => ({
                ...prev,
                name: user.firstName || '',
                email: user.email || ''
            }));
        } catch (error) {
            toast.error('Failed to fetch user details');
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
            toast.error('Please fill in all the fields');
            return;
        }

        if (!isValidPhoneNumber(formData.phone)) {
            toast.error('Phone number must start with 044, 045, 048, or 049 followed by 6 digits');
            return;
        }

        try {
            await axiosInstance.post('/Contact', formData);
            toast.success('Message sent successfully!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    return (
        <Container maxWidth="xs" className="mt-40 md:mt-10 mb-10 p-5 bg-white shadow-md rounded-lg">
            <Typography variant="h5" align="left" className="!mb-4 font-extrabold text-gray-600">
                Contact Us
            </Typography>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Box className="space-y-4">
                    <TextField
                        fullWidth
                        label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                    >
                        Send Message
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default ContactForm;