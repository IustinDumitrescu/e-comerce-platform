import { TextField, MenuItem } from "@mui/material";

export default function CategorySelect({value, loading, categories, handleChange, variant = 'outlined', sx={}}) {
    return (
            <TextField 
                select
                label=""
                name="categoryId"
                value={value}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant={variant}
                required
                sx={sx}
                SelectProps={{
                    displayEmpty: true
                }}
            >
                <MenuItem value="">
                    Category
                </MenuItem>
                
                {loading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                    ) : ( 
                    categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))
                )}
            </TextField>
    );
}