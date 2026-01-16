import { useParams } from "react-router-dom";
import Header from "../components/Header";
import useViewProduct from "../hooks/useViewProduct";
import UnloggedLayout from "../layouts/UnloggedLayout";
import {
    Box,
    Typography,
    Button,
    Card,
    CardMedia,
    Chip,
    Divider,
    Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import useCart from "../hooks/useCart";

function Product() {
    const { id } = useParams();
    const { getProduct, loading } = useViewProduct();
    const [product, setProduct] = useState(null);
    const { addCartItem } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            const result = await getProduct(id);
            if (!result || result.type === "error") return;
            setProduct(result);
        };

        fetchProduct();
    }, [id]);

    if (loading || !product) {
        return <LoadingScreen />;
    }

    return (
        <UnloggedLayout>
            <Header
                title={`Products | ${product.title}`}
                metaName="description"
                metaContent={product.description}
            />

            <Box
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    px: 2,
                    py: 6,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 6
                }}
            >
                {/* IMAGE */}
                <Card
                    sx={{
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: 4,
                        borderRadius: 3
                    }}
                >
                    <CardMedia
                        component="img"
                        image={`/api/images/product/${product.image}`}
                        alt={product.title}
                        sx={{
                            maxHeight: 420,
                            objectFit: "contain"
                        }}
                    />
                </Card>

                {/* DETAILS */}
                <Card
                    sx={{
                        p: 4,
                        boxShadow: 3,
                        borderRadius: 3
                    }}
                >
                    <Stack spacing={3}>
                        <Box>
                            <Chip
                                label={product.category}
                                color="primary"
                                size="small"
                                sx={{ mb: 1 }}
                            />

                            <Typography variant="h4" fontWeight={700}>
                                {product.title}
                            </Typography>
                        </Box>

                        <Typography
                            variant="h5"
                            color="primary"
                            fontWeight={700}
                        >
                            ${product.price.toLocaleString()}
                        </Typography>

                        <Divider />

                        <Typography variant="body1" color="text.secondary">
                            {product.description}
                        </Typography>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            sx={{ mt: 2 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={() => { addCartItem(product) }}
                            >
                                Add to Cart
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                            >
                                Buy Now
                            </Button>
                        </Stack>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ pt: 2 }}
                        >
                            Created on {product.createdAt}
                        </Typography>
                    </Stack>
                </Card>
            </Box>
        </UnloggedLayout>
    );
}

export default Product;
