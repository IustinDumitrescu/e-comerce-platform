import LoggedRoute from './LoggedRoute';
import UnloggedLayout from '../layouts/UnloggedLayout';
import Header from '../components/Header';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { paths } from '../config/routes';
import useViewProduct from '../hooks/useViewProduct';
import { 
  Card, CardContent, CardActions, Typography, 
  Stack, Chip, Button, Divider, Skeleton, Box
} from "@mui/material";
import { ArrowBack } from '@mui/icons-material';

function ViewProduct() {
    const { id } = useParams();
    const {getProduct, loading} = useViewProduct();

    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            const result = await getProduct(id);
        
            if (!result || result.type === 'error') {
                navigate(paths.myProducts, { replace: true });
                return;
            }

            setProduct(result);
        };

        fetchProduct();
    }, []);

    return (
          <LoggedRoute>
            <UnloggedLayout>
                <Header
                    title={product ? `Product: ${product.title}` : "Loading..."}
                    metaName="description"
                    metaContent={product ? `Details for ${product.title}` : ""}
                />

                <Stack spacing={3} sx={{padding: 5}}>
                    <Stack sx={{ flexDirection: 'row', alignItems: 'center'}} spacing={2}>
                        <Button 
                            variant='text'
                            startIcon={<ArrowBack/>}
                            onClick={() => navigate(paths.myProducts)}
                        >
                            My Products
                        </Button>
                    </Stack>

                    <Card sx={{ padding: 4, width: '100%',borderRadius: 4}}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            {loading || ! product ? (
                                <Skeleton variant="text" width={200} height={40} />
                            ) : (
                                <Typography variant="h5" fontWeight={600}>
                                    {product.title}
                                </Typography>
                            )}

                            {loading || !product ? (
                                <Skeleton variant="rectangular" width={80} height={32} />
                            ) : (
                                <Chip
                                    label={product.active ? "Active" : "Inactive"}
                                    color={product.active ? "success" : "default"}
                                    sx={{ fontWeight: 600 }}
                                />
                            )}
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        {loading || !product ? (
                            <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
                        ) : (
                            <Box sx={{ width: "100%", mb: 2, textAlign: "center" }}>
                                <img 
                                    src={`/api/images/product/${product.image}`} 
                                    alt={product.title} 
                                    style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 4 }} 
                                    title={product.tit}
                                />
                            </Box>
                        )}

                        <CardContent sx={{ p: 0 }}>
                            <Stack spacing={1.5}>
                                {loading || !product ? (
                                    <>
                                        <Skeleton variant="text" width={120} />
                                        <Skeleton variant="text" width={100} />
                                        <Skeleton variant="text" width={180} />
                                        <Skeleton variant="text" width={180} />
                                        <Skeleton variant="rectangular" width="100%" height={80} />
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Category:</strong> {product.category}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Price:</strong> ${product.price}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Created At:</strong> {product.createdAt}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Updated At:</strong> {product.updatedAt}
                                        </Typography>

                                        <Typography variant="body1" sx={{ mt: 1 }}>
                                            {product.description}
                                        </Typography>
                                    </>
                                )}
                            </Stack>
                        </CardContent>

                        <Divider sx={{ my: 2 }} />

                        <CardActions sx={{ justifyContent: "space-between" }}>
                            {loading ? (
                                <>
                                    <Skeleton variant="rectangular" width={140} height={36} />
                                    <Skeleton variant="rectangular" width={140} height={36} />
                                </>
                            ) : (
                                <>
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        onClick={() => navigate(paths.editProduct.replace(':id', product.id))}
                                    >
                                        Edit Product
                                    </Button>
                                </>
                            )}
                        </CardActions>
                    </Card>
                </Stack>
            </UnloggedLayout>
        </LoggedRoute>
    );
}

export default ViewProduct;