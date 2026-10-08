import {
  SavingsOutlined
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography
} from "@mui/material";
import { formatFileSize } from "../../utils/file";

interface StorageSavingsCardProps {
  savings: number;
  groupCount: number;
}

function StorageSavingsCard({
  savings,
  groupCount
}: StorageSavingsCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        background:
          "linear-gradient(135deg, rgba(0, 188, 212, 0.14), rgba(15, 23, 42, 0.85))",
        borderColor:
          "rgba(0, 188, 212, 0.22)"
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                "rgba(0, 188, 212, 0.12)",
              color: "info.main"
            }}
          >
            <SavingsOutlined />
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Potential Storage Savings
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mt: 0.25
              }}
            >
              {formatFileSize(savings)}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Across {groupCount} duplicate{" "}
              {groupCount === 1
                ? "group"
                : "groups"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StorageSavingsCard;