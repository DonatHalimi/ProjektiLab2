import { Alert, Box, Button, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { generateTourReport } from '../../services/tourService';

const TourReports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [tourName, setTourName] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReport = async () => {
    setLoading(true);
    const criteria = {
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      userEmail,
      tourName,
      sortBy,
    };

    try {
      const response = await generateTourReport(criteria);
      setReportData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData.map(row => ({
      'Tour Name': row.tour.name,
      'User Email': row.user.email,
      'Reserved Tickets': row.reservedTickets,
      'Total Price': row.totalPrice,
      'Purchase Date': new Date(row.purchaseDate).toLocaleDateString(),
      'Start Date': new Date(row.tour.startDate).toISOString().slice(0, 16),
      'End Date': new Date(row.tour.endDate).toISOString().slice(0, 16),
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, 'tour_report.xlsx');
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Generate Tour Report
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="User Email"
                fullWidth
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Tour Name"
                fullWidth
                value={tourName}
                onChange={(e) => setTourName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="PurchaseDate">Purchase Date</MenuItem>
                  <MenuItem value="TotalPrice">Total Price</MenuItem>
                  <MenuItem value="ReservedTickets">Reserved Tickets</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleGenerateReport} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Generate Report'}
              </Button>
            </Grid>
          </Grid>
        </Box>
        {reportData.length > 0 && (
          <>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tour Name</TableCell>
                    <TableCell>User Email</TableCell>
                    <TableCell>Reserved Tickets</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.tour.name}</TableCell>
                      <TableCell>{row.user.email}</TableCell>
                      <TableCell>{row.reservedTickets}</TableCell>
                      <TableCell>${row.totalPrice}</TableCell>
                      <TableCell>{new Date(row.purchaseDate).toISOString().slice(0, 16)}</TableCell>
                      <TableCell>{new Date(row.tour.startDate).toISOString().slice(0, 16)}</TableCell>
                      <TableCell>{new Date(row.tour.endDate).toISOString().slice(0, 16)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Box sx={{ m: 2 }}>
              <Button variant="contained" sx={{ backgroundColor: 'green' }} onClick={handleExportToExcel}>
                Export to Excel
              </Button>
            </Box>
          </>
        )}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default TourReports;