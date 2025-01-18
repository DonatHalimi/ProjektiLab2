import { Alert, Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { getCurrentUser } from '../../services/authService';
import { createRoomPurchase, getRooms } from '../../services/roomService';

const UserRoomPurchase = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCurrentUser();
        setProfile(response);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms();
        setRooms(response.data);
        setFilteredRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    let filtered = rooms;

    if (search) {
      filtered = filtered.filter((room) =>
        room.roomType.toLowerCase().includes(search.toLowerCase()) ||
        room.hotelName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter) {
      filtered = filtered.filter((room) => room.roomType === filter);
    }

    if (sort) {
      filtered = [...filtered].sort((a, b) => {
        if (sort === 'price') {
          return a.price - b.price;
        } else if (sort === 'startDate') {
          return new Date(a.startDate) - new Date(b.startDate);
        } else if (sort === 'endDate') {
          return new Date(a.endDate) - new Date(b.endDate);
        }
        return 0;
      });
    }

    setFilteredRooms(filtered);
  }, [search, filter, sort, rooms]);

  const handleReserve = async () => {
    if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
      setError('Please provide valid check-in and check-out dates.');
      return;
    }

    if (!guests || guests <= 0) {
      setError('Please enter a valid number of guests.');
      return;
    }

    const roomPurchase = {
      userId: profile.id,
      roomId: selectedRoom.id,
      startDate,
      endDate,
      guests: parseInt(guests, 10),
      status,
    };

    try {
      await createRoomPurchase(roomPurchase);
      setOpen(true);
      setStartDate('');
      setEndDate('');
      setGuests('');
      setSelectedRoom(null);
      setDialogOpen(false);
    } catch (error) {
      setError('Failed to reserve room.');
      console.error('Error reserving room:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleDialogOpen = (room) => {
    setSelectedRoom(room);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRoom(null);
    setStartDate('');
    setEndDate('');
    setGuests('');
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const uniqueTypes = [...new Set(rooms?.map((room) => room.roomType))];

  const paginatedRooms = filteredRooms?.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Navbar />
      <div className='container mx-auto mt-10'>
        <Typography variant="h4" gutterBottom>
          Available Rooms
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {uniqueTypes.map((roomType) => (
                <MenuItem key={roomType} value={roomType}>
                  {roomType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="startDate">Start Date</MenuItem>
              <MenuItem value="endDate">End Date</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={3}>
          {paginatedRooms?.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, backgroundColor: '#f5f5f5' }}>
                <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {room.hotelName}
                  </Typography>
                  <Typography variant="body1">
                    Location: {room.hotelLocation}
                  </Typography>
                  <Typography variant="body1">
                    Room Type: {room.roomType}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price: {room.price}$ per night
                  </Typography>
                </CardContent>
                <CardActions sx={{ padding: 2, backgroundColor: '#e0e0e0', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary" onClick={() => handleDialogOpen(room)}>
                    Reserve
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredRooms?.length / pageSize)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ m: 2 }}
          />
        </Box>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Reserve Room</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedRoom?.hotelName} - {selectedRoom?.roomType} (${selectedRoom?.price} per night)
            </DialogContentText>
            <TextField
              margin="dense"
              label="Check-In Date"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Check-Out Date"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Guests"
              type="number"
              fullWidth
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleReserve} color="primary">
              Reserve
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Room reserved successfully!
          </Alert>
        </Snackbar>
        {error && (
          <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserRoomPurchase;
