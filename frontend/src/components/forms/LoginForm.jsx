import { Paper, Box, Stack, Typography, TextField, Button } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { paths } from "../../config/routes"
import { useState } from "react";
import Flash from "../Flash";
import useLogin from "../../hooks/useLogin";
import FormTemplate from "./FormTemplate";

const USER_CREDENTIALS = {
    email: '',
    password: ''
};

export default function LoginForm() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState(USER_CREDENTIALS);

    const [flash, setFlash] = useState({
        type: 'error',
        message: ''
    });

    const {loginUser, loading} = useLogin();


    const handleChange = (e) => {
        setCredentials(
            {...credentials, [e.target.name]: e.target.value}
        )
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (credentials.email.length < 3) {
            setFlash({type: 'error', message: 'Email must have at least 3 characters'});
            return;
        }

        if (credentials.password.length < 8) {
            setFlash({type: 'error', message: 'Password must have at least 8 characters'});
            return;
        }

        const result = await loginUser(credentials);

        if (result.type && result.type == 'error') {
            setFlash({type: 'error', message: result.message});

            return;
        }

        setCredentials(USER_CREDENTIALS);

        navigate(paths.home);
    };

    return (
        <FormTemplate flash={flash} setFlash={setFlash}>
            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <Typography variant="h5" fontWeight={700} mb={0.5}>
                        Login
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={3}>
                         Welcome back — please enter your credentials
                    </Typography>

                    <TextField
                        fullWidth
                        name="email"
                        label="Email"
                        type="email"
                        margin="normal"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        margin="normal"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        loading={loading}
                        sx={{ mt: 2, py: 1.2, textTransform: "none", fontWeight: 600 }}
                    >
                        Login
                    </Button>

                    <Typography mt={2} textAlign="center" variant="body2">
                        Don’t have an account?{" "}
                        <Link to={paths.register} color="secondary.main" underline="hover">
                            Register
                        </Link>
                    </Typography> 
                
                </Stack>
            </Box>
        </FormTemplate>
    )
}