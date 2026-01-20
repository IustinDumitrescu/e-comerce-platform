import Header from "../components/Header";
import UnloggedLayout from "../layouts/UnloggedLayout";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  IconButton,
  CardContent,
  Divider,
  Grid
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { paths } from "../config/routes";
import useCart from "../hooks/useCart";
import { useMemo, useState } from "react";
import CheckoutConfirmDialog from "../components/modal/CheckoutConfirmDialog";
import usePlaceOrder from "../hooks/usePlaceOrder";
import Flash from "../components/Flash";
import useUser from "../hooks/useUser";

function Cart() {
  const navigate = useNavigate();

  const { cartItems , addCartItem, removeCartItem, deleteCartItem, setCartItems} = useCart();

  const [openCheckOut, setOpenCheckout] = useState(false);
  const [flash, setFlash]  = useState({
        type: 'error',
        message: ''
  });

  const {placeOrder, loading} = usePlaceOrder();

  const { user } = useUser();

  const subTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);


  const doOrder = async () => {
    const result = await placeOrder(cartItems);

    setOpenCheckout(false);

    if (result.type === 'success') {
      setCartItems([]);
    }

    setFlash(result);
  };

  if (!cartItems.length) {
    return (
      <UnloggedLayout>
        <Header title="Cart" />
        <Box textAlign="center" py={10}>
          <ShoppingCartIcon sx={{ fontSize: 80, color: "grey.400" }} />
          <Typography variant="h5" mt={2}>
            Your cart is empty
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Add items to get started
          </Typography>
          <Button variant="contained" onClick={() => navigate(paths.home)}>
            Shop now
          </Button>
        </Box>
      </UnloggedLayout>
    );
  }

  return (
    <UnloggedLayout>
      <Header title="Cart" />

      <Flash
          open={flash.message.length > 0}
          message={flash.message}
          severity={flash.type}
          onClose={() => setFlash({...flash, message: ''})}
      />

      <CheckoutConfirmDialog
        open={openCheckOut}
        onClose={() => setOpenCheckout(false)}
        onConfirm={doOrder}
        loading={loading}
        totalPrice={subTotal}
      />

      <Box maxWidth="lg" mx="auto" px={2} py={4}>
        <Typography variant="h4" fontWeight={600} mb={4}>
          Shopping Cart
        </Typography>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid size={{ xs: 12}}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Stack spacing={3}>
                  {cartItems.map((item) => (
                    <Box key={item.id}>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        {/* Left */}
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            component="img"
                            src={'/api/images/product/' + item.image}
                            alt={item.name}
                            sx={{
                              width: 160,
                              height: 80,
                              borderRadius: 2,
                            }}
                          />

                          <Box>
                            <Typography fontWeight={600}>
                              {item.title}
                            </Typography>
                            <Typography color="text.secondary">
                              ${item.price.toFixed(2)}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Right */}
                        <Stack direction="row" spacing={1} alignItems="center">
                          <IconButton size="small" onClick={() => removeCartItem(item.id)}>
                            <Remove />
                          </IconButton>

                          <Typography minWidth={24} textAlign="center">
                            {item.quantity}
                          </Typography>

                          <IconButton size="small" onClick={() => addCartItem(item)}>
                            <Add />
                          </IconButton>

                          <IconButton color="error" size="small" onClick={() => deleteCartItem(item.id)}>
                            <Delete />
                          </IconButton>
                        </Stack>
                      </Stack>

                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12}}>
            <Card sx={{ borderRadius: 4, position: "sticky", top: 24 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Order Summary
                </Typography>

                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Subtotal</Typography>
                    <Typography>${subTotal.toFixed(2)}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Shipping</Typography>
                    <Typography>Free</Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" justifyContent="space-between" mb={3}>
                  <Typography fontWeight={600}>Total</Typography>
                  <Typography fontWeight={600}>
                    ${subTotal.toFixed(2)}
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ borderRadius: 2, py: 1.2 }}
                  onClick={() => {
                    if (!user) {
                      navigate(paths.login);
                      return;
                    }
                    setOpenCheckout(true)
                  }}
                >
                  Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </UnloggedLayout>
  );
}

export default Cart;
