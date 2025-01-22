import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        <Paper elevation={3} className="p-8 max-w-2xl mx-auto">
            <Typography variant="h4" className="mb-6 text-center">
                Contact Us
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box className="space-y-4">
                    <TextField
                        fullWidth
                        label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
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
        </Paper>
    );
};

export default ContactForm; 