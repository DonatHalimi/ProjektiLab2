import React, { useEffect, useState } from 'react';
import { deleteTourPurchase, getTourPurchases } from '../../utils/axiosInstance';  // Update to reflect correct API imports
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

const TourPurchaseList = () => {
    const [tourPurchases, setTourPurchases] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTourPurchases = async () => {
            try {
                const response = await getTourPurchases();
                console.log('API Response:', response.data);
                const tourPurchasesData = response.data || [];
                console.log('Tour Purchases Data:', tourPurchasesData);
                setTourPurchases(tourPurchasesData);
            } catch (error) {
                console.error('Error fetching tour purchases:', error);
            }
        };

        fetchTourPurchases();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteTourPurchase(id);
            setTourPurchases(tourPurchases.filter(tourPurchase => tourPurchase.id !== id));
        } catch (error) {
            console.error('Error deleting tour purchase:', error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-tour-purchase/${id}`);
    };

    const handleCreate = () => {
        navigate('/create-tour-purchase');
    };

    return (
        <>
            <Navbar />
            <Container>
                <Typography variant="h4" gutterBottom>
                    Tour Purchase List
                </Typography>
                <Button variant="contained" color="primary" onClick={handleCreate} style={{ marginBottom: '20px' }}>
                    Create Tour Purchase
                </Button>
                <TableContainer component={Paper} style={{ width: '100%', margin: '20px' }}>
                    <Table>
                        <TableHead style={{ backgroundColor: '#f2f2f2' }}>
                            <TableRow>
                                <TableCell>User Id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Tour Name</TableCell>
                                <TableCell>Ticket Reserved</TableCell>
                                <TableCell>City</TableCell>  
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Total Price</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tourPurchases.map((purchase) => (
                                <TableRow key={purchase.id}>
                                    <TableCell>{purchase.user.id}</TableCell>
                                    <TableCell>{purchase.user.firstName}</TableCell>
                                    <TableCell>{purchase.user.email}</TableCell>
                                    <TableCell>{purchase.tour.name}</TableCell> 
                                    <TableCell>{purchase.reservedTickets}</TableCell>  
                                    <TableCell>{purchase.tour.city}</TableCell>  
                                    <TableCell>{purchase.tour.startDate}</TableCell>  
                                    <TableCell>{purchase.tour.endDate}</TableCell>  
                                    <TableCell>{purchase.totalPrice}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" style={{ margin: '10px', backgroundColor: 'orange' }} onClick={() => handleEdit(purchase.id)}>
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDelete(purchase.id)} style={{ marginTop: '10px', backgroundColor: 'red' }}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Footer />
        </>
    );
};

export default TourPurchaseList;