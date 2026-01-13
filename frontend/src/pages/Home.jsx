import UnloggedLayout from '../layouts/UnloggedLayout';
import Header from '../components/Header';
import { Grid } from '@mui/material';
import { Stack, Typography, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import useFindAllProducts from '../hooks/useFindAllProducts';
import ProductCard from '../components/cards/ProductCard';
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { paths } from '../config/routes';
import useCart from '../hooks/useCart';

function Home() {
  const [products, setProducts] = useState([]);
  const { getProducts, loading } = useFindAllProducts();
  const { user } = useUser();
  const navigate = useNavigate();
  const { addCartItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProducts({limit: 6, active: true});
      setProducts(result.products);
    };

    fetchProducts();
  }, [getProducts]);

  return (
    <UnloggedLayout>
      <Header
        title={'Home | My Portfolio App'}
        metaName={'description'}
        metaContent={
          'Welcome to my portfolio built with React, Symfony and Docker.'
        }
      />
       
      <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Welcome to Our Store
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Explore quality products made just for you
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => {
            if (!user) {
              navigate(paths.login)
              return;
            }
          }}
        >
          Browse Products
        </Button>
      </Box>

       <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 6 }}>
        <Typography variant="h4" fontWeight={600} mb={3}>
          Featured Products
        </Typography>

        <Grid container spacing={3}>
            {products.map((product) => (
              <Grid
                key={product.id}
                size={{ xs: 12, sm: 6, md: 4}}
              >
                <ProductCard
                  product={product}
                  onAddToCart={() => {
                    addCartItem(product);
                  }}
                  onView={() => {}}
                />
              </Grid>
            ))}
        </Grid>  

        {!loading && products.length === 0 && (
          <Stack alignItems="center" mt={6}>
            <Typography variant="h6" color="text.secondary">
              No products available yet.
            </Typography>
          </Stack>
        )}   
      </Box>
    </UnloggedLayout>
  );
}

export default Home;
