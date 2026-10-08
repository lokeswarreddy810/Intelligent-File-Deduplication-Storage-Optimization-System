import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export function LoadingSpinner({
  message = "Loading...",
  size = 32
}: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        minHeight: 160,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        py: 4
      }}
    >
      <CircularProgress
        size={size}
        thickness={4}
      />

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {message}
      </Typography>
    </Box>
  );
}