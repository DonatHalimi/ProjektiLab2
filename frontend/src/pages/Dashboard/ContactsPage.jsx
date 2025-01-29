import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DashboardHeader, exportOptions, exportToExcel, exportToJSON, formatDate, LoadingDataGrid } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddContactModal from '../../components/Modal/Contact/AddContactModal';
import DeleteModal from '../../components/Modal/DeleteModal';
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
        { key: 'message', label: 'Message', },
        {
            key: 'createdAt',
            label: 'Submitted At',
            render: (row) => formatDate(row.createdAt),
        },
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
        const id = Array.isArray(contactId) ? contactId[0] : contactId;

        setSelectedContacts(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
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

    const handleExport = (data, format) => {
        format === 'excel' ? exportToExcel(data, 'contacts_data') : exportToJSON(data, 'contacts_data');
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
                            exportOptions={exportOptions(contacts, handleExport)}
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
                    items={selectedContacts.map(id => contacts.find(contact => contact.id === id)).filter(contact => contact)}
                    onDeleteSuccess={() => {
                        fetchContacts();
                        setSelectedContacts([]);
                    }}
                    endpoint="/Contact/delete-bulk"
                    title="Delete Contacts"
                    message={`Are you sure you want to delete ${selectedContacts.length} selected contact${selectedContacts.length === 1 ? '' : 's'}?`}
                />
            </div>
        </div>
    );
};

export default ContactsPage;