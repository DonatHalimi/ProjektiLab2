import { Box, CssBaseline, Toolbar } from '@mui/material';
import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import Header from '../../components/Navbar';

const drawerWidth = 240;

const AdminDashboard = () => {
  return (
    <>
      <Header />
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
      <Footer />
    </>
  );
};

export default AdminDashboard;