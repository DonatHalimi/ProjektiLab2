import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, MenuItem, Select, InputLabel, FormControl, CircularProgress, Snackbar, Alert } from '@mui/material';
import { generateReport } from '../../utils/axiosInstance';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [flightName, setFlightName] = useState('');
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
      flightName,
      sortBy,
    };

    try {
      const response = await generateReport(criteria);
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
      'Flight Name': row.flight.name,
      'User Email': row.user.email,
      'Seats Reserved': row.seatsReserved,
      'Total Price': row.totalPrice,
      'Purchase Date': new Date(row.purchaseDate).toLocaleDateString(),
      'Start Date': new Date(row.flight.startDate).toISOString().slice(0, 16),
      'End Date': new Date(row.flight.endDate).toISOString().slice(0, 16),
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, 'report.xlsx');
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Generate Report
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
                label="Flight Name"
                fullWidth
                value={flightName}
                onChange={(e) => setFlightName(e.target.value)}
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
                  <MenuItem value="SeatsReserved">Seats Reserved</MenuItem>
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
                    <TableCell>Flight Name</TableCell>
                    <TableCell>User Email</TableCell>
                    <TableCell>Seats Reserved</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.flight.name}</TableCell>
                      <TableCell>{row.user.email}</TableCell>
                      <TableCell>{row.seatsReserved}</TableCell>
                      <TableCell>${row.totalPrice}</TableCell>
                      <TableCell>{new Date(row.purchaseDate).toISOString().slice(0, 16)}</TableCell>
                      <TableCell>{new Date(row.flight.startDate).toISOString().slice(0, 16)}</TableCell>
                      <TableCell>{new Date(row.flight.endDate).toISOString().slice(0, 16)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Box sx={{ m: 2 }}>
              <Button variant="contained" sx={{ backgroundColor : 'green'}} onClick={handleExportToExcel}>
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
      <Footer />
    </>
  );
};

export default Reports;