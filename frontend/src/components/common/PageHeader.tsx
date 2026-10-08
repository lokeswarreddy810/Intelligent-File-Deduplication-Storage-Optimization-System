import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

function PageHeader({
  title,
  description,
  action
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: {
          xs: "flex-start",
          sm: "center"
        },
        justifyContent: "space-between",
        gap: 2,
        mb: 4,
        flexDirection: {
          xs: "column",
          sm: "row"
        }
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 0.5
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {description}
          </Typography>
        )}
      </Box>

      {action}
    </Box>
  );
}

export default PageHeader;