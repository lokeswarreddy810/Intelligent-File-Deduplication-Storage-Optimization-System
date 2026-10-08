import {
  RefreshOutlined,
  TrendingDownOutlined
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import DuplicateChart from "../../components/dashboard/DuplicateChart";
import LargestFilesTable from "../../components/dashboard/LargestFilesTable";
import RecentUploadsTable from "../../components/dashboard/RecentUploadsTable";
import StorageChart from "../../components/dashboard/StorageChart";
import StorageOverview from "../../components/dashboard/StorageOverview";
import { useAnalytics } from "../../hooks/useAnalytics";
import { formatFileSize } from "../../utils/file";

function DashboardPage() {
  const {
    analytics,
    isLoading,
    error,
    refresh
  } = useAnalytics();

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        description="Monitor your storage usage and identify opportunities to reduce duplicate data."
        action={
          <Button
            variant="outlined"
            startIcon={
              isLoading ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <RefreshOutlined />
              )
            }
            onClick={() => void refresh()}
            disabled={isLoading}
          >
            Refresh
          </Button>
        }
      />

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void refresh()}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <StorageOverview
        analytics={analytics}
        isLoading={isLoading}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, minmax(0, 1fr))"
          },
          gap: 2.5,
          mb: 3
        }}
      >
        <StorageChart
          analytics={analytics}
          isLoading={isLoading}
        />

        <DuplicateChart
          analytics={analytics}
          isLoading={isLoading}
        />
      </Box>

      {analytics && (
        <Box
          sx={{
            mb: 3,
            p: 2.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(135deg, rgba(16, 185, 129, 0.10), rgba(6, 182, 212, 0.05))"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                color: "success.main"
              }}
            >
              <TrendingDownOutlined />
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Potential storage savings
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 800 }}
              >
                {formatFileSize(
                  analytics.potential_storage_savings
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "repeat(2, minmax(0, 1fr))"
          },
          gap: 2.5
        }}
      >
        <LargestFilesTable
          files={analytics?.largest_files ?? []}
          isLoading={isLoading}
        />

        <RecentUploadsTable
          files={analytics?.recent_uploads ?? []}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
}

export default DashboardPage;