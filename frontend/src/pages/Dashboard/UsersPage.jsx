import React, { useEffect, useState } from 'react';
import { DashboardHeader, exportOptions, exportToExcel, exportToJSON, LoadingDataGrid } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddUserModal from '../../components/Modal/User/AddUserModal';
import EditUserModal from '../../components/Modal/User/EditUserModal';
import { getUsers } from '../../services/userService';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [deleteUserOpen, setDeleteUserOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSelectUser = (userId) => {
        const id = Array.isArray(userId) ? userId[0] : userId;

        setSelectedUsers((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((selectedId) => selectedId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(user => user._id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditUserOpen(true);
    };

    const columns = [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'password', label: 'Password' },
        {
            key: 'role',
            label: 'Role',
            render: (user) => user.role ? user.role.name : 'N/A'
        },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (data, format) => {
        const flattenedUsers = data.map(user => ({
            ...user,
            role: user.role?.name || 'N/A',
        }));

        format === 'excel' ? exportToExcel(flattenedUsers, 'users_data') : exportToJSON(data, 'users_data');
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loading ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Users"
                            selectedItems={selectedUsers}
                            setAddItemOpen={setAddUserOpen}
                            setDeleteItemOpen={setDeleteUserOpen}
                            itemName="User"
                            exportOptions={exportOptions(users, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={users}
                            selectedItems={selectedUsers}
                            onSelectItem={handleSelectUser}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            containerClassName='user'
                        />
                    </>
                )}

                <AddUserModal open={addUserOpen} onClose={() => setAddUserOpen(false)} onAddSuccess={fetchUsers} />
                <EditUserModal open={editUserOpen} onClose={() => setEditUserOpen(false)} user={selectedUser} onEditSuccess={fetchUsers} />
                <DeleteModal
                    open={deleteUserOpen}
                    onClose={() => setDeleteUserOpen(false)}
                    items={selectedUsers.map(id => users.find(user => user.id === id)).filter(user => user)}
                    onDeleteSuccess={() => {
                        fetchUsers()
                        setSelectedUsers([]);
                    }}
                    endpoint="/users/delete-bulk"
                    title="Delete Users"
                    message="Are you sure you want to delete the selected users?"
                />
            </div>
        </div >
    );
};

export default UsersPage;