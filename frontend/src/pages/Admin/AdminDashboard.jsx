import React from 'react';
import { Container, Typography, AppBar, Toolbar, CssBaseline, Box } from '@mui/material';
import FlightList from '../Flights/FlightList';
import FlightPurchaseList from '../Flights/FlightPurchaseList';
import AdminSidebar from '../../components/AdminSidebar';
import Header from '../../components/Navbar';
import Footer from '../../components/Footer';


const drawerWidth = 240;

const AdminDashboard = () => {
  return (
<>
<Header/>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AdminSidebar />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, width: `calc(100% - ${drawerWidth}px)` }}
        >
          <Toolbar />
        </Box>
      </Box>
      <Footer/>
      </>
  );
};

export default AdminDashboard;