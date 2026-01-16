import { useEffect, useState } from "react";
import Header from "../components/Header";
import UnloggedLayout from "../layouts/UnloggedLayout";
import useFindAllProducts from "../hooks/useFindAllProducts";
import { Box, TextField, InputAdornment, IconButton, Paper, MenuItem, Grid, Typography, Pagination, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import useDebounce from "../hooks/useDebounce";
import ProductCard from "../components/cards/ProductCard";
import useCart from "../hooks/useCart";
import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";
import useCategories from "../hooks/useCategories";
import CategorySelect from "../components/inputs/CategorySelect";
import { useNavigate } from "react-router-dom";
import { paths } from "../config/routes";

const DEFAULT_QUERY = {
    limit: 20,
    page: 1,
    active: true,
    search: '',
    categoryId: '',
    order: 'created_desc'
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
    const [products, setProducts] = useState({
        products: [],
        totalProducts: 0
    });
    const [query, setQuery] = useState(DEFAULT_QUERY);
    const bounceSearch = useDebounce({value: query.search});
    const {getProducts, loading} = useFindAllProducts();
    const {data: categories, isLoading} = useCategories();
    const { addCartItem } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const result = await getProducts(query);
            setProducts(result.products);
        };

        fetchProducts();
    }, [getProducts, query.limit, query.page, bounceSearch, query.categoryId, query.order]);


    return (
        <UnloggedLayout>
            <Header
                title={'Products | My Portfolio App'}
                metaName={'description'}
                metaContent={
                    'Welcome to my portfolio built with React, Symfony and Docker.'
                }
            />

            <Box sx={{ padding: 5, marginBottom: 5 }}>
                    <Grid container spacing={3}>
                        <Grid item size={{xs: 12}}>
                          <Typography
                            component="h1"
                            variant="h4"
                            fontWeight={600}
                            color="text.secondary"
                          >
                                Our Products
                          </Typography>
                        </Grid>

                        <Grid item size={{xs: 12, md: 8}}>
                            <Paper 
                                elevation={3} 
                                sx={{
                                    borderRadius: 3,
                                    maxWidth: '100%',
                                    p: 1.5,
                                }}
                            >
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
                                                        setQuery({...query, search: ''})}
                                                    }
                                                >
                                                    <ClearIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Paper>
                        </Grid>

                        <Grid item size={{xs: 12, md: 2}}>
                              <Paper 
                                elevation={3} 
                                sx={{
                                    borderRadius: 3,
                                    maxWidth: '100%',
                                    p: 1.5,
                                }}
                            >
                                <CategorySelect
                                    categories={categories}
                                    loading={isLoading}
                                    value={query.categoryId}    
                                    handleChange={(e) => {
                                        setQuery({...query, categoryId: e.target.value})
                                    }}
                                    sx={{margin: 0}}
                                    variant="standard"
                                />
                            </Paper>
                        </Grid>

                        <Grid item size={{xs: 12, md: 2}}>
                            <Paper 
                                elevation={3} 
                                sx={{
                                    borderRadius: 3,
                                    maxWidth: '100%',
                                    p: 1.5,
                                }}
                            >
                                <TextField
                                    select
                                    label=""
                                    value={query.order}
                                    onChange={(e) => {
                                        setQuery({...query, order: e.target.value})
                                    }}
                                    fullWidth
                                    variant="standard"
                                      SelectProps={{
                                        displayEmpty: true
                                    }}
                                    sx={{margin: 0}}
                                >
                                    <MenuItem value="">Order</MenuItem>
                                    <MenuItem value="name_asc">Name (A–Z)</MenuItem>
                                    <MenuItem value="name_desc">Name (Z–A)</MenuItem>
                                    <MenuItem value="price_asc">Price (Low → High)</MenuItem>
                                    <MenuItem value="price_desc">Price (High → Low)</MenuItem>
                                    <MenuItem value="created_desc">Newest</MenuItem>
                                </TextField>
                            </Paper>
                        </Grid>

                        {loading && <SkeletonListing/>}        

                        {!loading && products.products.map((product => (
                            <Grid
                                key={product.id}
                                size={{ xs: 12, sm: 6, md: 4, lg: 3}}
                            >
                                <ProductCard
                                    product={product}
                                    onAddToCart={() => {
                                        addCartItem(product);
                                    }}
                                    onView={() => {
                                        navigate(paths.product.replace(':id', product.id));
                                    }}
                                />
                            </Grid>
                        )))}

                        {!loading && products.products.length > 0 && 
                            <Grid item size={{ xs: 12}}>
                                <Paper 
                                    elevation={3} 
                                    sx={{
                                        borderRadius: 3,
                                        maxWidth: '100%',
                                        p: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Pagination
                                        count={Math.ceil(products.totalProducts / query.limit)} // total pages
                                        page={query.page} // controlled page
                                        onChange={(e, value) => setQuery({ ...query, page: value })}
                                        color="primary"
                                        showFirstButton
                                        showLastButton
                                    />
                                </Paper>
                            </Grid>
                        }

                        {!loading && products.products.length === 0 && (
                            <Grid item size={{xs: 12}}>
                                <Typography variant="h6" color="text.secondary" textAlign={'center'}>
                                    No products available yet.
                                </Typography>
                            </Grid>
                        )}   
                 </Grid>
            </Box>    
        </UnloggedLayout>
    );
}

export default ProductListing;