import {
  ArchiveOutlined,
  ContentCopyOutlined,
  StorageOutlined,
  SavingsOutlined
} from "@mui/icons-material";
import { Box } from "@mui/material";
import StatCard from "./StatCard";
import { formatFileSize } from "../../utils/file";
import type { StorageAnalytics } from "../../types/analytics";

interface StorageOverviewProps {
  analytics: StorageAnalytics | null;
  isLoading: boolean;
}

function StorageOverview({
  analytics,
  isLoading
}: StorageOverviewProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          xl: "repeat(4, minmax(0, 1fr))"
        },
        gap: 2.5,
        mb: 3
      }}
    >
      <StatCard
        title="Total Files"
        value={
          analytics
            ? analytics.total_files.toLocaleString("en-IN")
            : "0"
        }
        description="Files stored in your account"
        icon={<ArchiveOutlined />}
        accent="#6366F1"
        isLoading={isLoading}
      />

      <StatCard
        title="Total Storage"
        value={
          analytics
            ? formatFileSize(analytics.total_storage)
            : "0 B"
        }
        description="Total storage currently consumed"
        icon={<StorageOutlined />}
        accent="#06B6D4"
        isLoading={isLoading}
      />

      <StatCard
        title="Duplicate Files"
        value={
          analytics
            ? analytics.duplicate_files.toLocaleString("en-IN")
            : "0"
        }
        description="Files identified as duplicates"
        icon={<ContentCopyOutlined />}
        accent="#F59E0B"
        isLoading={isLoading}
      />

      <StatCard
        title="Potential Savings"
        value={
          analytics
            ? formatFileSize(
                analytics.potential_storage_savings
              )
            : "0 B"
        }
        description="Storage recoverable from duplicates"
        icon={<SavingsOutlined />}
        accent="#10B981"
        isLoading={isLoading}
      />
    </Box>
  );
}

export default StorageOverview;