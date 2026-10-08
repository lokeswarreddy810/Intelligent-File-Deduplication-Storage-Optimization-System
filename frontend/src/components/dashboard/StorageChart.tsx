import { StorageOutlined } from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { StorageAnalytics } from "../../types/analytics";
import { formatFileSize } from "../../utils/file";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface StorageChartProps {
  analytics: StorageAnalytics | null;
  isLoading: boolean;
}

function StorageChart({
  analytics,
  isLoading
}: StorageChartProps) {
  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            Storage Distribution
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
              Loading storage analytics...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const totalStorage = analytics?.total_storage ?? 0;
  const duplicateStorage = analytics?.duplicate_storage ?? 0;
  const uniqueStorage = Math.max(
    totalStorage - duplicateStorage,
    0
  );

  const chartData = {
    labels: ["Unique Storage", "Duplicate Storage"],
    datasets: [
      {
        data: [uniqueStorage, duplicateStorage],
        backgroundColor: [
          "#6366F1",
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
      },
      tooltip: {
        callbacks: {
          label: (context: {
            label: string;
            parsed: number;
          }) =>
            `${context.label}: ${formatFileSize(
              context.parsed
            )}`
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
          <StorageOutlined color="primary" />

          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              Storage Distribution
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Unique versus duplicate storage
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

export default StorageChart;