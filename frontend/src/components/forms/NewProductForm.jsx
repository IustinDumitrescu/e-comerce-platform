import { useState } from "react";
import FormTemplate from "./FormTemplate";
import { Box, Button, TextField, MenuItem, InputAdornment, Typography} from "@mui/material";
import useCategories from "../../hooks/useCategories";
import ImageUploadField from "../inputs/ImageUploadField";
import useNewProduct from "../../hooks/useNewProduct";
import { FormControlLabel, Switch } from "@mui/material";

const NEW_PRODUCT = {
    title: '',
    description: '',
    price: 0,
    categoryId: '',
    image: null, 
    active: true
};

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function NewProductForm() {
    const [newProduct, setNewProduct] = useState(NEW_PRODUCT); 

    const [flash, setFlash] = useState({
        type: 'error',
        message: ''
    });

    const {data: categories, isLoading} = useCategories();

    const {createNewProduct, loading} = useNewProduct();

    const validateProduct = () => {
        if (newProduct.title.length < 3) {
            return {type: 'error', message: 'The name must have at least 3 characters'};
        }

        if (newProduct.description.length < 30) {
            return {type: 'error', message: 'The description must have at least 30 characters'};
        }   

        if (!newProduct.price) {
            return {type: 'error', message: 'Price must be bigger than 0'};
        }

        if (!newProduct.image || newProduct.image.size > 2000000 || !IMAGE_TYPES.includes(newProduct.image.type)) {
            return {type: 'error', message: 'Image must have at most 2MB and must be jpeg, png or webp'}
        }

        return {type: 'success', message: ''}
    };


    const handleChange = (e) => {
        setNewProduct(
            {...newProduct, [e.target.name]: e.target.value}
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validate = validateProduct();

        if (validate.type === 'error') {
            setFlash(validate);

            return;
        }
        
        const result = await createNewProduct(newProduct);

        setFlash(result);

        if (result.type !== 'error') {
            setNewProduct(NEW_PRODUCT);
        }
        
        return;
    };
    
    return (
        <FormTemplate flash={flash} setFlash={setFlash}>
             <Typography component={'h5'} fontWeight={600}>
                    Create New Product
             </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                 <TextField
                    fullWidth
                    name="title"
                    label="Name"
                    margin="normal"
                    value={newProduct.title}
                    onChange={handleChange}
                    required
                 />

                <TextField 
                    label="Description" 
                    name="description"
                    fullWidth 
                    multiline 
                    value={newProduct.description}
                    onChange={handleChange}
                    rows={4} 
                    required
                />

                <TextField 
                    select
                    label="Category"
                    name="categoryId"
                    value={newProduct.categoryId}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    required
                    
                >
                    {isLoading ? (
                        <MenuItem disabled>Loading...</MenuItem>
                        ) : (
                        categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))
                    )}
                </TextField>

                 <TextField
                    label="Price"
                    type="number"
                    value={newProduct.price}
                    onChange={handleChange}
                    name="price"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        inputProps: { min: 0, step: 0.01 } // allows decimals
                    }}
                    required
                />
                <ImageUploadField
                    file={newProduct.image}
                    setImgUrl={(file) => {
                        setNewProduct({...newProduct, image: file});
                    }}
                />

                <FormControlLabel
                    control={
                        <Switch
                        checked={newProduct.active}
                        onChange={(e) => setNewProduct({...newProduct, active: e.target.checked})}
                        />
                    }
                    label={newProduct.active ? "Active" : "Inactive"}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, py: 1.2, textTransform: "none", fontWeight: 600 }}
                    loading={loading}
                >
                    Create
                </Button>
            </Box>
        </FormTemplate>
    );
}