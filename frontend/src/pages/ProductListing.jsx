import { useEffect, useState } from "react";
import Header from "../components/Header";
import UnloggedLayout from "../layouts/UnloggedLayout";
import useFindAllProducts from "../hooks/useFindAllProducts";
import { Box, TextField, InputAdornment, IconButton, Paper, Stack, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import useDebounce from "../hooks/useDebounce";
import ProductCard from "../components/cards/ProductCard";
import useCart from "../hooks/useCart";
import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";

const DEFAULT_QUERY = {
    limit: 20,
    page: 1,
    active: true,
    search: ''
};

const SkeletonListing = () => {
    const arr = Array(DEFAULT_QUERY.limit).fill(1);

    return (
        <>
            {arr.map((_,item) => 
                <Grid  
                    key={'product_skeleton_' + item}
                    size={{ xs: 12, sm: 6, md: 4, lg: 3}}
                >
                    <ProductCardSkeleton/>
                </Grid>
            )}
        </>
    );
}

function ProductListing() {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState(DEFAULT_QUERY);
    const bounceSearch = useDebounce({value: query.search});

    const {getProducts, loading} = useFindAllProducts();
    const { addCartItem } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            const result = await getProducts(query);
            setProducts(result.products);
        };

        fetchProducts();
    }, [getProducts, query.limit, query.page, bounceSearch]);

    return (
        <UnloggedLayout>
            <Header
                title={'Products | My Portfolio App'}
                metaName={'description'}
                metaContent={
                    'Welcome to my portfolio built with React, Symfony and Docker.'
                }
            />

            <Box sx={{ padding: 5 }}>
                 <Paper 
                    elevation={3} 
                    sx={{
                        borderRadius: 3,
                        maxWidth: '100%',
                        p: 1.5,
                        marginBottom: 5
                    }}
                >
                    <Stack direction="row" alignItems="center">
                        <TextField
                            fullWidth
                            placeholder="Search products..."
                            value={query.search}
                            onChange={(e) => {
                                setQuery({...query, search: e.target.value})
                            }}
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: query.search.length > 0 && (
                                    <InputAdornment position="end">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => {
                                                setQuery({...query, search: ''})}}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                </Paper>  

                <Grid container spacing={3}>
                    {loading && <SkeletonListing/>}        

                    {!loading && products.map((product => (
                         <Grid
                             key={product.id}
                             size={{ xs: 12, sm: 6, md: 4, lg: 3}}
                        >
                            <ProductCard
                                product={product}
                                onAddToCart={() => {
                                    addCartItem(product);
                                }}
                                onView={() => {}}
                            />
                        </Grid>
                    )))}
                </Grid> 
            </Box>    
        </UnloggedLayout>
    );
}

export default ProductListing;