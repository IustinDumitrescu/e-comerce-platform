import { Button, Stack, Typography } from '@mui/material';
import Header from '../components/Header';
import UnloggedLayout from '../layouts/UnloggedLayout';
import LoggedRoute from './LoggedRoute';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { paths } from '../config/routes';
import NewProductForm from '../components/forms/NewProductForm';

function NewProduct() {
    const navigate = useNavigate();

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

                    <NewProductForm/>
                </Stack>
            </UnloggedLayout>
        </LoggedRoute>
    )
}

export default NewProduct;