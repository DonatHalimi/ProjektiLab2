import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Typography,
    Paper
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { DashboardHeader, LoadingDataGrid } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddFAQModal from '../../components/Modal/FAQ/AddFAQModal';
import EditFAQModal from '../../components/Modal/FAQ/EditFAQModal';
import { getFAQs, deleteBulkFAQs } from '../../services/faqService';
import { toast } from 'react-toastify';

const FAQsPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFAQs, setSelectedFAQs] = useState([]);
    const [selectedFAQ, setSelectedFAQ] = useState(null);
    const [addFAQOpen, setAddFAQOpen] = useState(false);
    const [editFAQOpen, setEditFAQOpen] = useState(false);
    const [deleteFAQOpen, setDeleteFAQOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 5;

    const columns = [
        {
            key: 'id',
            label: 'ID',
            flex: 1,
            renderCell: (params) => (
                <Typography noWrap title={params.value}>
                    {params.value}
                </Typography>
            )
        },
        {
            key: 'question', 
            label: 'Question', 
            flex: 1,
            renderCell: (params) => (
                <Typography noWrap title={params.value}>
                    {params.value}
                </Typography>
            )
        },
        { 
            key: 'answer', 
            label: 'Answer', 
            flex: 2,
            renderCell: (params) => (
                <Typography noWrap title={params.value}>
                    {params.value}
                </Typography>
            )
        },
        { 
            key: 'createdAt', 
            label: 'Created At', 
            flex: 1,
            valueFormatter: (params) => new Date(params.value).toLocaleDateString() 
        },
        { 
            key: 'updatedAt', 
            label: 'Updated At', 
            flex: 1,
            valueFormatter: (params) => new Date(params.value).toLocaleDateString() 
        }
    ];

    const fetchFAQs = async () => {
        try {
            setLoading(true);
            const response = await getFAQs();
            console.log('FAQs:', response);
            // Map the response to include id field
            const mappedFAQs = response.map(faq => ({
                ...faq,
            }));
            console.log('Mapped FAQs:', mappedFAQs);
            setFaqs(mappedFAQs);
            setFilteredFaqs(mappedFAQs);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            toast.error('Failed to fetch FAQs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs();
    }, []);

    useEffect(() => {
        const filtered = faqs.filter(faq => 
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredFaqs(filtered);
        setCurrentPage(0);
    }, [searchQuery, faqs]);

    const handleSelectFAQ = (faqId) => {
        setSelectedFAQs(prev => {
            if (prev.includes(faqId)) {
                return prev.filter(id => id !== faqId);
            }
            return [...prev, faqId];
        });
    };

    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setSelectedFAQs(filteredFaqs.map(faq => faq._id));
        } else {
            setSelectedFAQs([]);
        }
    };

    const handleEdit = (faq) => {
        setSelectedFAQ(faq);
        setEditFAQOpen(true);
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteFAQs = async () => {
        try {
            // Make sure we're sending an array of strings
            const idsToDelete = selectedFAQs.map(id => id.toString());
            await deleteBulkFAQs(idsToDelete);
            toast.success('FAQs deleted successfully');
            await fetchFAQs();
            setSelectedFAQs([]);
            setDeleteFAQOpen(false);
        } catch (error) {
            console.error('Error deleting FAQs:', error);
            toast.error('Failed to delete FAQs');
        }
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loading ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="FAQs Management"
                            selectedItems={selectedFAQs}
                            setAddItemOpen={setAddFAQOpen}
                            setDeleteItemOpen={setDeleteFAQOpen}
                            itemName="FAQ"
                        />

                        <Paper className="w-full mb-4 p-4">
                            <Box className="flex items-center">
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Search FAQs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchQuery && (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setSearchQuery('')}>
                                                    <ClearIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>
                        </Paper>

                        <DashboardTable
                            columns={columns}
                            data={filteredFaqs}
                            selectedItems={selectedFAQs}
                            onSelectItem={handleSelectFAQ}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            containerClassName='faq'
                        />

                    </>
                )}

                <AddFAQModal 
                    open={addFAQOpen} 
                    onClose={() => setAddFAQOpen(false)} 
                    onAddSuccess={fetchFAQs} 
                />
                <EditFAQModal 
                    open={editFAQOpen} 
                    onClose={() => setEditFAQOpen(false)} 
                    faq={selectedFAQ} 
                    onEditSuccess={fetchFAQs} 
                />
                <DeleteModal
                    open={deleteFAQOpen}
                    onClose={() => setDeleteFAQOpen(false)}
                    items={selectedFAQs}
                    onDelete={handleDeleteFAQs}
                    title="Delete FAQs"
                    message={`Are you sure you want to delete ${selectedFAQs.length} selected FAQ${selectedFAQs.length === 1 ? '' : 's'}?`}
                />
            </div>
        </div>
    );
};

export default FAQsPage; 