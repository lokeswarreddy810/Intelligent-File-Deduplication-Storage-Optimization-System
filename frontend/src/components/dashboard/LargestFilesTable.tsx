import {
  InsertDriveFileOutlined,
  OpenInNewOutlined
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { AnalyticsFileItem } from "../../types/analytics";
import { formatDate } from "../../utils/date";
import { formatFileSize } from "../../utils/file";

interface LargestFilesTableProps {
  files: AnalyticsFileItem[];
  isLoading: boolean;
}

function LargestFilesTable({
  files,
  isLoading
}: LargestFilesTableProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            Largest Files
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Files consuming the most storage
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>File</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography
                      color="text.secondary"
                      sx={{ py: 2 }}
                    >
                      Loading files...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && files.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography
                      color="text.secondary"
                      sx={{ py: 2 }}
                    >
                      No files available.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                files.map((file) => (
                  <TableRow
                    key={file.id}
                    hover
                  >
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          minWidth: 0
                        }}
                      >
                        <InsertDriveFileOutlined
                          color="primary"
                          fontSize="small"
                        />

                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            maxWidth: {
                              xs: 120,
                              sm: 220
                            }
                          }}
                        >
                          {file.original_filename}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {formatFileSize(file.file_size)}
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatDate(file.created_at)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="View file">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(
                              `/files/${file.id}`
                            )
                          }
                        >
                          <OpenInNewOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default LargestFilesTable;