import Header from "../components/Header";
import UnloggedLayout from "../layouts/UnloggedLayout";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import useCart from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { paths } from "../config/routes";

function Cart() {
    const navigate = useNavigate();
    const { cartItems } = useCart();

    if (cartItems.length < 1) {
        return (
            <UnloggedLayout>
                <Header
                    title={'Cart | My Portfolio App'}
                    metaName={'description'}
                    metaContent={'Buy a new product'}
                />

                <Box sx={{ p: 4, textAlign: "center" }}>
                    <ShoppingCartIcon sx={{ fontSize: 90, color: "grey.400" }} />
                        <Typography variant="h5" sx={{ mt: 2 }}>
                            Your cart is empty
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Browse products and add items to your cart.
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() => {
                                navigate(paths.home)
                            }}
                        >
                            Shop now
                        </Button>
                </Box>
            </UnloggedLayout>
        );
    }

    return (
       <UnloggedLayout>
            <Header
                title={'Cart | My Portfolio App'}
                metaName={'description'}
                metaContent={'Buy a new product'}
            />

        </UnloggedLayout>
    )
}   

export default Cart;