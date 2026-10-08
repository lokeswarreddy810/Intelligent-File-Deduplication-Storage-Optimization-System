import {
  ContentCopyOutlined,
  FingerprintOutlined,
  SavingsOutlined
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import type { DuplicateGroup } from "../../types/duplicate";
import { formatDate } from "../../utils/date";
import { formatFileSize } from "../../utils/file";
import DuplicateFileRow from "./DuplicateFileRow";

interface DuplicateDetailsProps {
  group: DuplicateGroup;
}

function DuplicateDetails({
  group
}: DuplicateDetailsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 3
      }}
    >
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)"
              },
              gap: 2
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Files in group
              </Typography>

              <Typography
                variant="h5"
                sx={{ fontWeight: 800 }}
              >
                {group.total_files}
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
                variant="h5"
                sx={{ fontWeight: 800 }}
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
                variant="h5"
                sx={{
                  fontWeight: 800,
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
                File size
              </Typography>

              <Typography
                variant="h5"
                sx={{ fontWeight: 800 }}
              >
                {formatFileSize(
                  group.file_size
                )}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2
            }}
          >
            <FingerprintOutlined
              color="primary"
            />

            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                Content Identity
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Files are grouped using identical
                content hashes.
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "180px 1fr"
              },
              gap: 1.5
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Algorithm
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontWeight: 600
              }}
            >
              {group.algorithm}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Hash
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                wordBreak: "break-all"
              }}
            >
              {group.hash_value}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Last detected
            </Typography>

            <Typography variant="body2">
              {formatDate(
                group.last_detected_at
              )}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              p: 3,
              pb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5
            }}
          >
            <ContentCopyOutlined
              color="warning"
            />

            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                Files in This Group
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                The original file and all files
                containing identical content.
              </Typography>
            </Box>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  File
                </TableCell>

                <TableCell>
                  Size
                </TableCell>

                <TableCell>
                  Type
                </TableCell>

                <TableCell>
                  Uploaded
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <DuplicateFileRow
                file={group.original_file}
                isOriginal
              />

              {group.duplicate_files.map(
                (file) => (
                  <DuplicateFileRow
                    key={file.id}
                    file={file}
                  />
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card
        sx={{
          borderColor:
            "rgba(16, 185, 129, 0.25)",
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(15, 23, 42, 0.75))"
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
            <SavingsOutlined
              color="success"
            />

            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700 }}
              >
                Potential storage recovery
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Removing redundant copies could
                recover{" "}
                <Box
                  component="span"
                  sx={{
                    color: "success.main",
                    fontWeight: 700
                  }}
                >
                  {formatFileSize(
                    group.potential_savings
                  )}
                </Box>{" "}
                of storage.
              </Typography>
            </Box>

            <Chip
              label="Duplicate content"
              color="warning"
              variant="outlined"
              sx={{ ml: "auto" }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DuplicateDetails;