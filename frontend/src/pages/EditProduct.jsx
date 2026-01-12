import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import UnloggedLayout from '../layouts/UnloggedLayout';
import LoggedRoute from './LoggedRoute';
import useViewProduct from '../hooks/useViewProduct';
import { useEffect, useState } from 'react';
import { paths } from '../config/routes';
import { Stack, Button} from '@mui/material';
import ProductForm from '../components/forms/ProductForm';
import { ArrowBack } from '@mui/icons-material';
import LoadingScreen from '../components/LoadingScreen';

function EditProduct() {
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
    }, [])

    if (loading || !product) {
        return <LoadingScreen/>;
    }

    return (
        <LoggedRoute>
            <UnloggedLayout>
                <Header
                    title={'New Product | My Portfolio App'}
                    metaName={'description'}
                    metaContent={'Create a new product'}
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

                    <ProductForm 
                        newProduct={product} 
                        setNewProduct={setProduct}
                        url={'/my-products/edit/' + product.id}
                        setProductOnResult={() => {}}
                    />
                </Stack>
            </UnloggedLayout>
        </LoggedRoute>
    );
}

export default EditProduct;