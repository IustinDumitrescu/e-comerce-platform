import Header from '../components/Header';
import UnloggedLayout from '../layouts/UnloggedLayout';
import LoggedRoute from './LoggedRoute';
import { Box, Button, Stack, Typography, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import useMyProducts from '../hooks/useMyProducts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../config/routes';


function MyProducts() {
    const navigate = useNavigate();

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [sortModel, setSortModel] = useState([]);

    const [filterModel, setFilterModel] = useState({ items: [] });

    const { data, isLoading } = useMyProducts({
        paginationModel, 
        sortModel, 
        filterModel 
    });

     const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'category', headerName: 'Category', width: 140 },
        { field: 'price', headerName: 'Price', width: 120 },
        { field: 'stock', headerName: 'Stock', width: 120 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => console.log('view', params.row.id)}
                >
                    <VisibilityIcon fontSize="small" />
                </IconButton>

                <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => console.log('edit', params.row.id)}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                </Stack>
            ),
        },
    ];

    return (
        <LoggedRoute>
            <UnloggedLayout>
                <Header
                    title={'My Products | My Portfolio App'}
                    metaName={'description'}
                    metaContent={'See your products and modify them'}
                />

                <Box sx={{ p: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5" fontWeight={600}>
                            My Products
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate(paths.newProduct)}
                        >
                            Create Product
                        </Button>
                    </Stack>

                    {/* Table */}
                    <DataGrid
                        loading={isLoading}
                        rows={data || 0}
                        rowCount={data ? data.length : 0}
                        columns={columns}
                        autoHeight
                        pageSizeOptions={[5, 10, 25]}
                        paginationMode='server'
                        sortingMode='server'
                        filterMode='server'
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        sortModel={sortModel}
                        onSortModelChange={setSortModel}
                        filterModel={filterModel}
                        onFilterModelChange={setFilterModel}
                    />
                </Box>
            </UnloggedLayout>
        </LoggedRoute>
    );
}

export default MyProducts;