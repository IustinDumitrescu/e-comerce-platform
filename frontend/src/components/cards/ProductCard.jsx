import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack,
  Box
} from "@mui/material";

export default function ProductCard({ product, onAddToCart, onView }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
        transition: "all .2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={`/api/images/product/${product.image}`} // adjust to your backend
          alt={product.title}
          sx={{ objectFit: "cover" }}
        />

        {product.active ? (
          <Chip
            label="Available"
            color="success"
            size="small"
            sx={{ position: "absolute", top: 10, right: 10 }}
          />
        ) : (
          <Chip
            label="Out of stock"
            color="default"
            size="small"
            sx={{ position: "absolute", top: 10, right: 10 }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="overline" color="text.secondary">
          {product.category}
        </Typography>

        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </Typography>

        <Typography variant="h6" mt={2} fontWeight={700}>
          ${product.price.toFixed(2)}
        </Typography>
      </CardContent>

      <CardActions>
        <Stack direction="row" spacing={1} width="100%">
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onView?.(product)}
          >
            View
          </Button>

          <Button
            fullWidth
            variant="contained"
            disabled={!product.active}
            onClick={() => onAddToCart?.(product)}
          >
            Add to cart
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}
