import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useLocation } from 'react-router-dom';
import { paths } from '../config/routes';
import { useEffect, useState } from 'react';

export default function Navbar({user, logout}) {
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {}, [])

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography 
                    component={Link} 
                    to={paths.home} 
                    variant="h6" 
                    sx={{ 
                        flexGrow: 1, 
                        color: 'inherit', 
                        textDecoration: 'none',
                        fontWeight: 600
                    }}
                >
                    My Shop
                </Typography>

                <Box>
                  {user ? (
                        <>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>{user.email}</MenuItem>
                                <MenuItem onClick={() => logout()}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                color={location.pathname === paths.login ? 'secondary' : 'inherit'}
                                component={Link}
                                to={paths.login}
                            >
                                Login
                            </Button>
                            <Button
                                color={location.pathname === paths.register ? 'secondary' : 'inherit'}
                                component={Link}
                                to={paths.register}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}