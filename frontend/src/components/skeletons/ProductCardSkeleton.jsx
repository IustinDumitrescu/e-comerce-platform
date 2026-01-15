import {
  Card,
  CardContent,
  CardActions,
  Skeleton,
  Stack,
  Box
} from "@mui/material";

export default function ProductCardSkeleton() {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Skeleton variant="rectangular" height={200} />

        <Skeleton
          variant="rounded"
          width={80}
          height={24}
          sx={{ position: "absolute", top: 10, right: 10 }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton width="40%" height={18} />

        <Skeleton width="80%" height={28} sx={{ mt: 1 }} />

        <Skeleton width="100%" height={18} />
        <Skeleton width="90%" height={18} />

        <Skeleton width="30%" height={28} sx={{ mt: 2 }} />
      </CardContent>

      <CardActions>
        <Stack direction="row" spacing={1} width="100%">
          <Skeleton variant="rounded" height={36} width="100%" />
          <Skeleton variant="rounded" height={36} width="100%" />
        </Stack>
      </CardActions>
    </Card>
  );
}
