import { ContentCopyOutlined } from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { StorageAnalytics } from "../../types/analytics";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface DuplicateChartProps {
  analytics: StorageAnalytics | null;
  isLoading: boolean;
}

function DuplicateChart({
  analytics,
  isLoading
}: DuplicateChartProps) {
  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            File Distribution
          </Typography>

          <Box
            sx={{
              height: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Typography color="text.secondary">
              Loading file analytics...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const totalFiles = analytics?.total_files ?? 0;
  const duplicateFiles = analytics?.duplicate_files ?? 0;
  const uniqueFiles = Math.max(
    totalFiles - duplicateFiles,
    0
  );

  const chartData = {
    labels: ["Unique Files", "Duplicate Files"],
    datasets: [
      {
        data: [uniqueFiles, duplicateFiles],
        backgroundColor: [
          "#06B6D4",
          "#F59E0B"
        ],
        borderColor: "#111827",
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#94A3B8",
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2
          }}
        >
          <ContentCopyOutlined color="warning" />

          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              File Distribution
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Unique versus duplicate files
            </Typography>
          </Box>
        </Box>

        <Box sx={{ height: 280 }}>
          <Doughnut
            data={chartData}
            options={chartOptions}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default DuplicateChart;