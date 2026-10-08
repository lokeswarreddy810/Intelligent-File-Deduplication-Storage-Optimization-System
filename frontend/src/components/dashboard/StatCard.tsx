import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography
} from "@mui/material";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  accent: string;
  isLoading?: boolean;
}

function StatCard({
  title,
  value,
  description,
  icon,
  accent,
  isLoading = false
}: StatCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 4,
          height: "100%",
          backgroundColor: accent
        }}
      />

      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {title}
            </Typography>

            {isLoading ? (
              <Skeleton
                variant="text"
                width={130}
                height={44}
              />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  wordBreak: "break-word"
                }}
              >
                {value}
              </Typography>
            )}

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 1
              }}
            >
              {description}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              minWidth: 44,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accent,
              backgroundColor: `${accent}18`
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatCard;