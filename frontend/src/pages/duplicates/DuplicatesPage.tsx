import {
  ContentCopyOutlined,
  RefreshOutlined
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import DuplicateGroupCard from "../../components/duplicates/DuplicateGroupCard";
import DuplicateGroupTable from "../../components/duplicates/DuplicateGroupTable";
import StorageSavingsCard from "../../components/duplicates/StorageSavingsCard";
import { useDuplicates } from "../../hooks/useDuplicates";
import { formatFileSize } from "../../utils/file";

function DuplicatesPage() {
  const navigate = useNavigate();

  const {
    groups,
    isLoading,
    error,
    refresh
  } = useDuplicates();

  const totalSavings = groups.reduce(
    (total, group) =>
      total + group.potential_savings,
    0
  );

  const totalDuplicateFiles =
    groups.reduce(
      (total, group) =>
        total + group.duplicate_files.length,
      0
    );

  return (
    <Box>
      <PageHeader
        title="Duplicate Groups"
        description="Find identical files and identify unnecessary storage consumption."
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
            onClick={() =>
              void refresh()
            }
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
              onClick={() =>
                void refresh()
              }
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))"
          },
          gap: 2.5,
          mb: 3
        }}
      >
        <Card>
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
                  color: "warning.main",
                  backgroundColor:
                    "rgba(245, 158, 11, 0.12)"
                }}
              >
                <ContentCopyOutlined />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Duplicate Groups
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800
                  }}
                >
                  {groups.length}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {totalDuplicateFiles} redundant{" "}
                  {totalDuplicateFiles === 1
                    ? "file"
                    : "files"}{" "}
                  identified
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <StorageSavingsCard
          savings={totalSavings}
          groupCount={groups.length}
        />
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              p: 3,
              pb: 2
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              Duplicate Groups
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Files with identical content are
              grouped together regardless of filename
              or upload time.
            </Typography>
          </Box>

          <Box
            sx={{
              display: {
                xs: "block",
                lg: "none"
              },
              p: 2
            }}
          >
            {isLoading ? (
              <Typography
                color="text.secondary"
                sx={{ p: 2 }}
              >
                Loading duplicate groups...
              </Typography>
            ) : groups.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{ p: 2 }}
              >
                No duplicate groups found.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: 2
                }}
              >
                {groups.map((group) => (
                  <DuplicateGroupCard
                    key={group.id}
                    group={group}
                    onViewDetails={(groupId) =>
                      navigate(
                        `/duplicates/${groupId}`
                      )
                    }
                  />
                ))}
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: {
                xs: "none",
                lg: "block"
              }
            }}
          >
            <DuplicateGroupTable
              groups={groups}
              isLoading={isLoading}
              onViewDetails={(groupId) =>
                navigate(
                  `/duplicates/${groupId}`
                )
              }
            />
          </Box>
        </CardContent>
      </Card>

      {!isLoading &&
        groups.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Potential savings:{" "}
              {formatFileSize(totalSavings)}
            </Typography>
          </Box>
        )}
    </Box>
  );
}

export default DuplicatesPage;