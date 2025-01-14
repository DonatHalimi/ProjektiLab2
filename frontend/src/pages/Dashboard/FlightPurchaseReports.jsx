import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button, CircularProgress, Collapse, Container, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { formatDate, handleExportFlightToExcel } from '../../assets/CustomComponents';
import { generateReport } from '../../services/flightService';

const FlightReports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [flightName, setFlightName] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);

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
      if (response.length === 0) {
        toast.info('No data found with the selected filters');
      }
      setReportData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container className="mt-16">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-white rounded-lg mb-2 cursor-pointer"
        >
          <div className="bg-white flex justify-between items-center">
            <Typography variant="h5" className="font-bold text-left mb-4">
              Generate Flight Report
            </Typography>
            <IconButton>
              {isFormOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </div>
        </div>

        <Collapse in={isFormOpen}>
          <form className="flex flex-wrap gap-4 mt-2 p-3">
            <div className="flex-1 min-w-[200px]">
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <TextField
                label="User Email"
                fullWidth
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                variant="outlined"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <TextField
                label="Flight Name"
                fullWidth
                value={flightName}
                onChange={(e) => setFlightName(e.target.value)}
                variant="outlined"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="PurchaseDate">Purchase Date</MenuItem>
                  <MenuItem value="TotalPrice">Total Price</MenuItem>
                  <MenuItem value="SeatsReserved">Seats Reserved</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="w-full">
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateReport}
                disabled={loading}
                className="px-6"
              >
                {loading ? <CircularProgress size={24} /> : 'Generate'}
              </Button>
            </div>
          </form>
        </Collapse>
      </div>

      {reportData.length > 0 && (
        <>
          <Paper className="mt-6 p-4">
            <div className="overflow-x-auto">
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
                      <TableCell>{formatDate(row.purchaseDate)}</TableCell>
                      <TableCell>{formatDate(row.flight.startDate)}</TableCell>
                      <TableCell>{formatDate(row.flight.endDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Paper>

          <div className="mt-4">
            <Button
              variant="contained"
              onClick={() => handleExportFlightToExcel(reportData)}
            >
              Export to Excel
            </Button>
          </div>
        </>
      )}
    </Container >
  );
};

export default FlightReports;