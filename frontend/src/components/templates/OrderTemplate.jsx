import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button
} from "@mui/material";

export default function OrderTemplate({order, loading, backTo}) {
    return (
        <>
            <Box sx={{ m: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={backTo}
                    variant="text"
                >
                    Back to orders
                </Button>
            </Box>

            <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
        
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
                </Box>
            )}

            {/* Not found */}
            {!loading && !order && (
                <Typography align="center" color="error">
                Order not found.
                </Typography>
            )}

            {/* Order content */}
            {!loading && order && (
                <Card>
                <CardContent>
                    {/* Header */}
                    <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                    >
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                        Order #{order.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        Created at: {order.createdAt}
                        </Typography>
                    </Box>

                    <Chip
                        label={order.status}
                        color={
                        order.status === "pending"
                            ? "warning"
                            : order.status === "paid"
                            ? "success"
                            : "default"
                        }
                    />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Items */}
                    <List>
                    {order.orderItems.map((item) => (
                        <ListItem key={item.id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar
                            variant="rounded"
                            src={`/api/images/product/${item.product.image}`}
                            alt={item.product.title}
                            sx={{ width: 64, height: 64, mr: 2 }}
                            />
                        </ListItemAvatar>

                        <ListItemText
                            primary={
                            <Typography fontWeight="bold">
                                {item.product.title}
                            </Typography>
                            }
                            secondary={
                            <>
                                <Typography variant="body2" color="text.secondary">
                                {item.product.category}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                {item.product.description}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                Qty: {item.quantity}
                                </Typography>
                            </>
                            }
                        />

                        <Box sx={{ textAlign: "right", minWidth: 120 }}>
                            <Typography fontWeight="bold">
                            {item.price} €
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            Subtotal: {item.price * item.quantity} €
                            </Typography>
                        </Box>
                        </ListItem>
                    ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    {/* Total */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="h6" fontWeight="bold">
                        Total: {order.price} €
                    </Typography>
                    </Box>
                </CardContent>
                </Card>
            )}
            </Box>
        </>
    ) 
}