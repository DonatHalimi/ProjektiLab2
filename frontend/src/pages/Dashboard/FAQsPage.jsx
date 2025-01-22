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
import { getFAQs } from '../../services/faqService';
import { toast } from 'react-toastify';

const FAQsPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedFAQ, setSelectedFAQ] = useState(null);
    const [selectedFAQs, setSelectedFAQs] = useState([]);
    const [addFAQOpen, setAddFAQOpen] = useState(false);
    const [editFAQOpen, setEditFAQOpen] = useState(false);
    const [deleteFAQOpen, setDeleteFAQOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 5;

    const fetchFAQs = async () => {
        try {
            setLoading(true);
            const response = await getFAQs();
            const mappedFAQs = response.map(faq => ({
                ...faq,
                id: faq._id
            }));
            setFaqs(mappedFAQs);
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

    const handleSelectFAQ = (faqId) => {
        const id = Array.isArray(faqId) ? faqId[0] : faqId;

        setSelectedFAQs((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((selectedId) => selectedId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedFAQs(faqs.map(faq => faq.id));
        } else {
            setSelectedFAQs([]);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (faq) => {
        setSelectedFAQ(faq);
        setEditFAQOpen(true);
    };

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
                            data={faqs.filter(faq => 
                                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                            )}
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

                <AddFAQModal open={addFAQOpen} onClose={() => setAddFAQOpen(false)} onAddSuccess={fetchFAQs} />
                <EditFAQModal open={editFAQOpen} onClose={() => setEditFAQOpen(false)} faq={selectedFAQ} onEditSuccess={fetchFAQs} />
                <DeleteModal
                    open={deleteFAQOpen}
                    onClose={() => setDeleteFAQOpen(false)}
                    items={selectedFAQs.map(id => faqs.find(faq => faq.id === id)).filter(faq => faq)}
                    onDeleteSuccess={() => {
                        fetchFAQs();
                        setSelectedFAQs([]);
                    }}
                    endpoint="/FAQ/delete-bulk"
                    title="Delete FAQs"
                    message="Are you sure you want to delete the selected FAQs?"
                />
            </div>
        </div>
    );
};

export default FAQsPage;