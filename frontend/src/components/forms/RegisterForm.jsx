import { Box, TextField, Typography, Button, Stack, Paper, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";
import Flash from "../Flash";
import useRegister from "../../hooks/useRegister";
import FormTemplate from "./FormTemplate";

const DEFAULT_ACC = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    tc: false
};

export default function RegisterForm() {
    const [query, setQuery] = useState(DEFAULT_ACC);

    const [flash, setFlash] = useState({
        type: 'error',
        message: ''
    });

    const {register, loading} = useRegister();

    const validateQuery = () => {
        if (query.name.length < 3) {
            return {type: 'error', message: 'Name must have at least 3 characters'};
        }

        if (query.email.length < 5 ) {
            return {type: 'error', message: 'Email is invalid'};
        }

        if (query.password.length < 8) {
            return {type: 'error', message : 'Password must have at least 8 characters'};
        }

        if (query.password !== query.confirmPassword) {
            return {type: 'error', message : 'Password and verify-password are not the same'};
        }

        if (!query.tc) {
            return {type: 'error', message: 'You need to accept the terms !'};
        }

        return {type: 'success', message: ''};
    };

    const handleChange = (e) => {
        setQuery({
            ...query, 
            [e.target.name]: e.target.value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validatedResult = validateQuery();

        if (validatedResult.type == 'error') {
            setFlash({type: 'error', message: validatedResult.message});

            return;
        }

        setFlash({type: 'error', message: ''})

        const result = await register(query);

        if (result.type == 'error') {
            setFlash({type: 'error', message: result.message});

            return;
        }

        setQuery(DEFAULT_ACC);

        setFlash({type: 'success', message: 'The account has been created with success!'});
    };

    return (
        <FormTemplate flash={flash} setFlash={setFlash}>
            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>

                    <Typography
                        variant="h5"
                        textAlign="center"
                        fontWeight={600}
                    >
                        Create account
                    </Typography>

                    <TextField
                        label="Name"
                        name="name"
                        value={query.name}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={query.email}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={query.password}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={query.confirmPassword}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={query.tc}
                                onChange={(e) => setQuery({...query, tc: e.target.checked})}
                                color="primary"
                            />
                        }
                        label="I agree to the terms"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        loading={loading}
                        fullWidth
                    >
                        Register
                    </Button>
                </Stack>
            </Box>
        </FormTemplate>
    )
}