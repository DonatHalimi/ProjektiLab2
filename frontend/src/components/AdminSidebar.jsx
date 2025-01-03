import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Drawer, Toolbar, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import FlightIcon from '@mui/icons-material/Flight';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Assessment } from '@mui/icons-material';
import HotelIcon from '@mui/icons-material/Hotel';
import MapIcon from '@mui/icons-material/Map';

const drawerWidth = 240;

const AdminSidebar = () => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Menu
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem button component={Link} to="/flights">
            <ListItemIcon>
              <FlightIcon />
            </ListItemIcon>
            <ListItemText primary="Flight List" />
          </ListItem>
          <ListItem button component={Link} to="/flight-purchases">
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Flight Purchase List" />
          </ListItem>

          <ListItem button component={Link} to="/reports">
            <ListItemIcon>
              <Assessment />
            </ListItemIcon>
            <ListItemText primary="Flight Reports" />
          </ListItem>

          <ListItem button component={Link} to="/tour-list">
            <ListItemIcon>
            <MapIcon />
            </ListItemIcon>
            <ListItemText primary="Tour List" />
          </ListItem>

          <ListItem button component={Link} to="/tour-purchases">
            <ListItemIcon>
            <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Tour Purchase List" />
          </ListItem>
          <ListItem button component={Link} to="/hotels">
            <ListItemIcon>
            <HotelIcon />
            </ListItemIcon>
            <ListItemText primary="Hotel List" />
          </ListItem>

          

        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;