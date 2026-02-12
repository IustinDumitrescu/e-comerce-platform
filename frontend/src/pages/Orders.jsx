import { useState } from "react";
import useOrders from "../hooks/useOrders";
import Header from "../components/Header";
import LoggedRoute from "./LoggedRoute";
import UnloggedLayout from "../layouts/UnloggedLayout";
import { Badge, Box, IconButton, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import useNotifications from "../hooks/useNotifications";

function Orders({type}) {
    const navigate = useNavigate();
    const { notifications, markAsRead} = useNotifications();

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [sortModel, setSortModel] = useState([]);

    const {data: orders, isLoading } = useOrders({
        type: type,
        paginationModel, 
        sortModel, 
        filterModel: {items: []}
    })

    const hasNotification = (notType) => {
        if (type === 'bought') {
            return notType === 'BUYER_NEW_ORDER';
        }

        return notType === 'SELLER_NEW_ORDER';
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'price', headerName: 'Price', flex: 2, readerCell: (params) => <>${params.price}</> },
        { field: 'status', headerName: 'Status', flex: 1},
        { field: 'createdAt', headerName: 'Created At', flex: 2 },
        { field: 'updatedAt', headerName: 'Updated At', flex: 2, renderCell: (params) => <>{params.updatedAt || '-'}</>},
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 2,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                const not = notifications.find((not) => params.row.id == not.data.orderId && hasNotification(not.type));

                return (
                    <Stack
                        direction="row"
                        spacing={1}
                        height="100%"
                        width="100%"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Badge
                            color="error"
                            variant="dot"
                            invisible={!not}
                            overlap="circular"
                        >
                            <IconButton
                                size="medium"     
                                color="primary"
                                onClick={() => {
                                    if (not) {
                                        markAsRead(not.id);
                                    }

                                    navigate(`/orders-${type.toLowerCase()}/${params.row.id}`);
                                }}
                            >
                                <VisibilityIcon fontSize="medium" />
                            </IconButton>
                        </Badge>
                    </Stack>
                );
            },
        }
    ];


    return (
        <LoggedRoute>
            <UnloggedLayout>
              <Header
                    title={`Orders ${type.toLowerCase()} | My Portfolio App`}
                    metaName={'description'}
                    metaContent={'See your orders'}
                />

                <Box sx={{p: 4}}>
                    <Stack direction={'row'} justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5" fontWeight={600}>
                            {`Orders ${type.toLowerCase()}`}
                        </Typography>
                    </Stack>

                    <DataGrid
                        loading={isLoading}
                        rows={orders || []}
                        rowCount={orders ? orders.length : 0}
                        columns={columns}
                        autoHeight
                        pageSizeOptions={[10, 20, 30]}
                        paginationMode='server'
                        sortingMode='server'
                        filterMode='server'
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        sortModel={sortModel}
                        onSortModelChange={setSortModel}
                        disableColumnFilter
                    />
                </Box>
            </UnloggedLayout>
        </LoggedRoute>
    );
}

export default Orders;