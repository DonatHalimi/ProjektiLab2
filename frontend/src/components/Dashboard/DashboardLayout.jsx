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
    const [open, setOpen] = useState(() => JSON.parse(localStorage.getItem('sidebarOpened')) ?? true);
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
        const newState = !open;
        setOpen(newState);
        localStorage.setItem('sidebarOpened', JSON.stringify(newState));
    };

    const handleProfileDropdownToggle = () => setIsDropdownOpen(prev => !prev);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsDropdownOpen(false);
    };

    return (
        <Box className="flex h-screen overflow-hidden bg-[#F5F5F5]">
            <DashboardNavbar
                open={open}
                toggleDrawer={toggleDrawer}
                auth={isAuthenticated}
                isDropdownOpen={isDropdownOpen}
                handleProfileDropdownToggle={handleProfileDropdownToggle}
                handleLogout={handleLogout}
                isAdmin={isAdmin}
            />
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? 250 : 78,
                    transition: 'width 0.4s ease-in-out',
                    height: '100vh',
                    overflow: 'hidden',
                    '& .custom-scrollbar': { height: '100%', overflowY: 'auto' },
                    '& .MuiDrawer-paper': {
                        width: open ? 250 : 78,
                        transition: 'width 0.4s ease-in-out',
                    }
                }}
            >
                <DashboardCollapse toggleDrawer={toggleDrawer} />
                <Divider />
                <div className="custom-scrollbar">
                    <List component="nav">
                        {mainListItems({ setCurrentView: () => { }, collapsed: !open })}
                        {secondaryListItems}
                    </List>
                </div>
            </Drawer>
            <Box
                component="main"
                role="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
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