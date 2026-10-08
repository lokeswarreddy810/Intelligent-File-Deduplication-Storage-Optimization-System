import {
  ArrowForwardOutlined,
  ContentCopyOutlined,
  SavingsOutlined
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography
} from "@mui/material";
import type { DuplicateGroup } from "../../types/duplicate";
import { formatDate } from "../../utils/date";
import { formatFileSize } from "../../utils/file";

interface DuplicateGroupCardProps {
  group: DuplicateGroup;
  onViewDetails: (
    groupId: string
  ) => void;
}

function DuplicateGroupCard({
  group,
  onViewDetails
}: DuplicateGroupCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            mb: 2
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700
              }}
              noWrap
            >
              {group.original_file.original_filename}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Duplicate group
            </Typography>
          </Box>

          <Chip
            icon={<ContentCopyOutlined />}
            label={`${group.total_files} files`}
            size="small"
            color="warning"
            variant="outlined"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)"
            },
            gap: 2
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              File size
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontWeight: 600 }}
            >
              {formatFileSize(
                group.file_size
              )}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Storage consumed
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontWeight: 600 }}
            >
              {formatFileSize(
                group.total_storage
              )}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Potential savings
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: "success.main"
              }}
            >
              {formatFileSize(
                group.potential_savings
              )}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Last detected
            </Typography>

            <Typography
              variant="body2"
            >
              {formatDate(
                group.last_detected_at
              )}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Duplicates
          </Typography>

          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 0.75
            }}
          >
            {group.duplicate_files
              .slice(0, 3)
              .map((file) => (
                <Typography
                  key={file.id}
                  variant="body2"
                  noWrap
                  sx={{
                    color: "text.secondary"
                  }}
                >
                  {file.original_filename}
                </Typography>
              ))}

            {group.duplicate_files.length >
              3 && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                +
                {group.duplicate_files.length -
                  3}{" "}
                more
              </Typography>
            )}
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 2.5 }}
          startIcon={<SavingsOutlined />}
          endIcon={<ArrowForwardOutlined />}
          onClick={() =>
            onViewDetails(group.id)
          }
        >
          View Group Details
        </Button>
      </CardContent>
    </Card>
  );
}

export default DuplicateGroupCard;