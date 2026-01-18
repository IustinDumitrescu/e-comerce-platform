import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";

function CheckoutConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading,
  totalPrice
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle fontWeight={600}>
        Confirm your order
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography>
            Are you sure you want to place this order?
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Your payment will be processed and your cart will be cleared.
          </Typography>

          <Typography variant="h6" fontWeight={700}>
            Total: ${totalPrice.toLocaleString()}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          loading={loading}
          variant="contained"
        >
          Place order
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CheckoutConfirmDialog;
