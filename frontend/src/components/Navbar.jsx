import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItemText,
  Stack,
  ListItemIcon,
  ListItemButton,
  Tooltip,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Link, useLocation } from 'react-router-dom';
import { paths } from '../config/routes';
import { useState } from 'react';
import useCart from '../hooks/useCart';
import useNotifications from '../hooks/useNotifications';
import useMercure from '../hooks/useMercure';

const drawerWidth = 240;

export default function Navbar({ user, logout }) {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cartItems } = useCart();
  const { notifications, addNotification} = useNotifications();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const initials = user?.email?.[0]?.toUpperCase() ?? '?';

  const sidebarItems = [
    { text: 'Dashboard', path: paths.dashboard, icon: <DashboardIcon color='primary'/> },
    { text: 'My Products', path: paths.myProducts, icon: <Inventory2Icon color='primary'/> },
    { text: 'Add Product', path: paths.newProduct, icon: <AddBoxIcon color='primary'/> },
    { text: 'My Orders', path: paths.myOrders, icon: <ReceiptLongIcon color='primary'/> },
  ];

  const cartQuantity = (() => {
    let total = 0;

    if (cartItems.length < 1) return total;

    for (const item of cartItems) {
      total += item.quantity;
    }

    return total;
  })();

  useMercure(
    user ? [`/user/${user.id}/notifications`]: [], 
    (result) => {
      addNotification(result)
      alert(result.message);
    }
  );

  return (
    <>
      <AppBar
        position="sticky"
        color="primary"
        elevation={4}
        sx={{
          backdropFilter: 'blur(6px)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <Toolbar sx={{ px: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 1 }}
              >
                <Badge
                  badgeContent={notifications.length}
                  color="error"
                  invisible={notifications.length === 0}
                >
                  <MenuIcon />
                </Badge>
              </IconButton>
            )}

            <Typography
              component={Link}
              to={paths.home}
              variant="h6"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                fontWeight: 700,
                letterSpacing: '.3px',
              }}
            >
              My Shop
            </Typography>
          </Box>

          {/* Right side: avatar or login/register */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               
             <Tooltip title="View cart">
              <IconButton
                component={Link}
                to={paths.cart}
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.25)" }
                }}
              >
                <Badge badgeContent={cartQuantity} color="error">
                  <ShoppingCartIcon htmlColor="white" />
                </Badge>
              </IconButton>
            </Tooltip>

            {user ? (
              <>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ p: 0.5 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      borderColor: 'inherit',
                      border: 0.5,
                      width: 34,
                      height: 34,
                      fontSize: 16,
                    }}
                  >
                    {initials}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem disabled sx={{ opacity: 0.9 }}>
                    {user.email}
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    component={Link}
                    to={paths.dashboard}
                    onClick={handleClose}
                  >
                    Dashboard
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to={paths.login}
                  variant="text"
                  color={location.pathname === paths.login ? 'secondary' : 'inherit'}
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>

                <Button
                  component={Link}
                  to={paths.register}
                  variant="text"
                  color={location.pathname === paths.register ? 'secondary' : 'inherit'}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {user && (
        <Drawer
          open={drawerOpen}
          onClose={toggleDrawer}
          variant="temporary"
          sx={{
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
         <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1, padding: 1 }}>
              <Box>
                 <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      borderColor: 'inherit',
                      border: 0.5,
                      width: 34,
                      height: 34,
                      fontSize: 16,
                    }}
                  >
                    {initials}
                  </Avatar>
              </Box>

              <Typography
                textAlign='center'
                ariant="subtitle1" fontWeight={600}
              >
                {user.name}
              </Typography>
          </Stack>
          
          <Divider/>

          <Box sx={{flexGrow: 1}}>
              <List style={{paddingTop: 0}}>
                {sidebarItems.map((item, index) => (
                    <ListItemButton
                      key={item.text + index}
                      component={Link}
                      to={item.path}
                      selected={location.pathname === item.path}
                      onClick={toggleDrawer} // close drawer after click
                    >
                      <ListItemIcon>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text}/>
                  </ListItemButton>
                ))}
              </List>
          </Box>

          <Box sx={{ p: 1, paddingTop: 0 }}>
            <Divider sx={{ mb: 1 }} />
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </Box>
        </Drawer>
      )}
    </>
  );
}
