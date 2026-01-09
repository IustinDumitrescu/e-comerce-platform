import { useState } from "react";
import FormTemplate from "./FormTemplate";
import { Box, Button, TextField, MenuItem, InputAdornment} from "@mui/material";
import useCategories from "../../hooks/useCategories";

const NEW_PRODUCT = {
    title: '',
    description: '',
    price: 0,
    categoryId: ''
};

export default function NewProductForm() {
    const [newProduct, setNewProduct] = useState(NEW_PRODUCT); 

    const [flash, setFlash] = useState({
        type: 'error',
        message: ''
    });

    const {data: categories, isLoading} = useCategories();

    const handleChange = (e) => {
        setNewProduct(
            {...newProduct, [e.target.name]: e.target.value}
        )
    }
    
    return (
        <FormTemplate flash={flash} setFlash={setFlash}>
            <Box component="form" onSubmit={() => {}}>
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
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, py: 1.2, textTransform: "none", fontWeight: 600 }}
                >
                    Create
                </Button>
            </Box>
        </FormTemplate>
    );
}