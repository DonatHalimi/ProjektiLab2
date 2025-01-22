import React, { useEffect, useState } from 'react';
import { DashboardHeader, LoadingDataGrid } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddContactModal from '../../components/Modal/Contact/AddContactModal';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [deleteContactOpen, setDeleteContactOpen] = useState(false);
    const [addContactOpen, setAddContactOpen] = useState(false);
    const itemsPerPage = 10;

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'subject', label: 'Subject' },
        { 
            key: 'message', 
            label: 'Message',
            render: (row) => (
                <div className="max-w-md truncate" title={row.message}>
                    {row.message}
                </div>
            )
        },
        { 
            key: 'createdAt', 
            label: 'Submitted At',
            render: (row) => new Date(row.createdAt).toLocaleString()
        }
    ];

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/Contact');
            setContacts(response.data);
        } catch (error) {
            toast.error('Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleSelectContact = (contactId) => {
        setSelectedContacts(prev => 
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setSelectedContacts(contacts.map(contact => contact.id));
        } else {
            setSelectedContacts([]);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteContacts = async () => {
        try {
            const idsToDelete = selectedContacts.map(id => id.toString());
            await axiosInstance.post('/Contact/delete-bulk', { 
                Ids: idsToDelete 
            });
            toast.success('Contacts deleted successfully');
            await fetchContacts();
            setSelectedContacts([]);
            setDeleteContactOpen(false);
        } catch (error) {
            console.error('Error deleting contacts:', error);
            toast.error('Failed to delete contacts');
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
                            title="Contact Messages"
                            selectedItems={selectedContacts}
                            setAddItemOpen={setAddContactOpen}
                            setDeleteItemOpen={setDeleteContactOpen}
                            itemName="Contact"
                        />

                        <DashboardTable
                            columns={columns}
                            data={contacts}
                            selectedItems={selectedContacts}
                            onSelectItem={handleSelectContact}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            containerClassName='contacts'
                        />
                    </>
                )}

                <AddContactModal 
                    open={addContactOpen} 
                    onClose={() => setAddContactOpen(false)} 
                    onAddSuccess={fetchContacts} 
                />

                <DeleteModal
                    open={deleteContactOpen}
                    onClose={() => setDeleteContactOpen(false)}
                    items={selectedContacts}
                    onDelete={handleDeleteContacts}
                    title="Delete Contacts"
                    message={`Are you sure you want to delete ${selectedContacts.length} selected contact${selectedContacts.length === 1 ? '' : 's'}?`}
                />
            </div>
        </div>
    );
};

export default ContactsPage; 