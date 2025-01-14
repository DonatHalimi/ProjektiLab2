import { AttachMoney, CalendarToday, ExpandLess, ExpandMore, PeopleAlt } from '@mui/icons-material'; // Icons for toggle
import { Button, CardContent, CircularProgress, Collapse, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { formatDate, handleExportRoomToExcel } from '../../assets/CustomComponents';
import { generateRoomReport } from '../../services/roomService';

const RoomReports = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [roomType, setRoomType] = useState('');
    const [status, setStatus] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minGuests, setMinGuests] = useState('');
    const [maxGuests, setMaxGuests] = useState('');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(true);

    const handleGenerateReport = async () => {
        setLoading(true);
        const criteria = {
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            userEmail,
            roomType,
            status,
            sortBy,
            minPrice: minPrice ? parseFloat(minPrice) : null,
            maxPrice: maxPrice ? parseFloat(maxPrice) : null,
            minGuests: minGuests ? parseInt(minGuests) : null,
            maxGuests: maxGuests ? parseInt(maxGuests) : null,
        };

        try {
            const response = await generateRoomReport(criteria);
            if (response.length === 0) {
                toast.info('No data found with the selected filters');
            }
            setReportData(response);
            setLoading(false);
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Failed to generate report. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Container className="mt-16 mb-28">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="rounded-lg mb-2 cursor-pointer"
                >
                    <div className="flex justify-between items-center">
                        <Typography variant="h5" className="font-bold text-left mb-4">
                            Generate Room Report
                        </Typography>
                        <IconButton>
                            {isFormOpen ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </div>
                </div>

                <Collapse in={isFormOpen}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Check-In Date"
                                    type="date"
                                    fullWidth
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <CalendarToday />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Check-Out Date"
                                    type="date"
                                    fullWidth
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <CalendarToday />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="User Email"
                                    fullWidth
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Room Type"
                                    fullWidth
                                    value={roomType}
                                    onChange={(e) => setRoomType(e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        label="Status"
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="Canceled">Canceled</MenuItem>
                                        <MenuItem value="Confirmed">Confirmed</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Sort By</InputLabel>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        label="Sort By"
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value="StartDate">Start Date</MenuItem>
                                        <MenuItem value="EndDate">End Date</MenuItem>
                                        <MenuItem value="TotalPrice">Total Price</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Min Price"
                                    type="number"
                                    fullWidth
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <AttachMoney />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Max Price"
                                    type="number"
                                    fullWidth
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <AttachMoney />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Min Guests"
                                    type="number"
                                    fullWidth
                                    value={minGuests}
                                    onChange={(e) => setMinGuests(e.target.value)}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <PeopleAlt />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Max Guests"
                                    type="number"
                                    fullWidth
                                    value={maxGuests}
                                    onChange={(e) => setMaxGuests(e.target.value)}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <IconButton>
                                                <PeopleAlt />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleGenerateReport}
                                    disabled={loading}
                                    className="px-6"
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Generate'}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Collapse>
            </div>

            {/* Report Table Section */}
            {reportData.length > 0 && (
                <>
                    <Paper className="mt-6 p-4">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Room Type</TableCell>
                                        <TableCell>User Email</TableCell>
                                        <TableCell>Guests</TableCell>
                                        <TableCell>Total Price</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reportData.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.room.roomType}</TableCell>
                                            <TableCell>{row.user.email}</TableCell>
                                            <TableCell>{row.guests}</TableCell>
                                            <TableCell>${row.totalPrice}</TableCell>
                                            <TableCell>{row.status}</TableCell>
                                            <TableCell>{formatDate(row.startDate)}</TableCell>
                                            <TableCell>{formatDate(row.endDate)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Paper>

                    <div className="mt-4">
                        <Button
                            variant="contained"
                            onClick={() => handleExportRoomToExcel(reportData)}
                        >
                            Export to Excel
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
};

export default RoomReports;