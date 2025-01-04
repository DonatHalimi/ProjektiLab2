import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { ActionButton, BlueCreateOutlinedIcon, CustomNoRowsOverlay, CustomToolbar } from '../../assets/CustomComponents';

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const DashboardTable = ({
    columns,
    data,
    selectedItems,
    onSelectItem,
    onRowRightClick,
    itemsPerPage,
    currentPage,
    onPageChange,
    renderTableActions,
    onEdit,
    containerClassName,
}) => {
    const gridColumns = columns.map((column) => ({
        field: column.key,
        headerName: column.label,
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
            if (column.key === 'actions') {
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <ActionButton onClick={() => onEdit(params.row)}>
                            <BlueCreateOutlinedIcon />
                        </ActionButton>
                    </div>
                );
            } else if (column.key === 'image') {
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        {column.render ? column.render(params.row) : null}
                    </div>
                );
            } else if (column.key === 'amenities' || column.key === 'roomTypes') {
                return Array.isArray(params.row[column.key])
                    ? params.row[column.key].join(', ')
                    : params.row[column.key];
            } else if (column.key === 'password' && containerClassName === 'user') {
                return '●●●●●●●●●●';
            } else {
                return column.render
                    ? column.render(params.row)
                    : getNestedValue(params.row, column.key);
            }
        },
    }));

    const gridRows = data.map((item) => ({
        id: item._id,
        ...item,
    }));

    const handleRowClick = (params, event) => {
        if (!event.target.closest('.MuiDataGrid-actionsCell') && !event.target.closest('.MuiDataGrid-imageCell')) {
            onSelectItem([params.id]);
        }
    };

    return (
        <>
            {renderTableActions && renderTableActions()}
            <Paper
                className={containerClassName || 'max-w-screen-2xl mx-auto'}
                style={{ height: 'auto', width: '100%', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
            >
                <DataGrid
                    rows={gridRows}
                    columns={gridColumns}
                    onSelectionModelChange={(newSelection) => onSelectItem(newSelection)}
                    onRowClick={handleRowClick}
                    onRowContextMenu={(event, params) => onRowRightClick(event, params.row)}
                    pageSize={itemsPerPage}
                    page={currentPage}
                    onPageChange={(params) => onPageChange(params.page)}
                    pagination
                    checkboxSelection
                    disableSelectionOnClick
                    initialState={{
                        density: 'comfortable',
                    }}
                    slots={{
                        toolbar: CustomToolbar,
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-main': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-columnHeader:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-columnHeader:focus-within': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-cell:focus-within': {
                            outline: 'none',
                        },
                        '--DataGrid-overlayHeight': '300px',
                    }}
                />
            </Paper>
        </>
    );
};

export default DashboardTable;