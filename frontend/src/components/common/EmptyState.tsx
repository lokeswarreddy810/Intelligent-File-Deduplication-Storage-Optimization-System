import {
  InsertDriveFileOutlined
} from "@mui/icons-material";
import {
  Box,
  Typography
} from "@mui/material";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        py: 4,
        px: 2
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
          backgroundColor:
            "rgba(99, 102, 241, 0.10)"
        }}
      >
        {icon ?? (
          <InsertDriveFileOutlined
            fontSize="medium"
          />
        )}
      </Box>

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          mt: 0.5
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 420,
            textAlign: "center"
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}