import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardCollapse, DashboardNavbar, Drawer } from '../../assets/CustomComponents';
import { getCurrentUser } from '../../services/authService';
import { mainListItems, secondaryListItems } from './listItems';

const DashboardLayout = () => {
    const isAuthenticated = localStorage.getItem('token');
    const [isAdmin, setIsAdmin] = useState(false);

    const [open, setOpen] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchAdminStatus = async () => {
            try {
                const response = await getCurrentUser();
                setIsAdmin(response.role === 'admin');
            } catch (error) {
                console.error('Error fetching admin status:', error);
            }
        };

        fetchAdminStatus();
    }, [isAuthenticated]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleProfileDropdownToggle = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsDropdownOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#F5F5F5' }}>
            <DashboardNavbar
                open={open}
                toggleDrawer={toggleDrawer}
                auth={isAuthenticated}
                isDropdownOpen={isDropdownOpen}
                handleProfileDropdownToggle={handleProfileDropdownToggle}
                handleLogout={handleLogout}
                isAdmin={isAdmin}
            />
            <Drawer variant="permanent" open={open}>
                <DashboardCollapse toggleDrawer={toggleDrawer} />

                <Divider />

                <List component="nav">
                    {mainListItems({ setCurrentView: () => { } })}
                    {/* <Divider sx={{ my: 1 }} /> */}
                    {secondaryListItems}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '105vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;