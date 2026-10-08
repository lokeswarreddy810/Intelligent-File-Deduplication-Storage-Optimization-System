import {
  DeleteOutlined,
  HistoryOutlined
} from "@mui/icons-material";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import type { DeletionHistory } from "../../types/deletion";
import { formatDate } from "../../utils/date";
import { formatFileSize } from "../../utils/file";
import { EmptyState } from "../common/EmptyState";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface DeletionHistoryTableProps {
  history: DeletionHistory[];
  isLoading: boolean;
}

function DeletionHistoryTable({
  history,
  isLoading
}: DeletionHistoryTableProps) {
  if (isLoading) {
    return (
      <LoadingSpinner
        message="Loading deletion history..."
      />
    );
  }

  if (history.length === 0) {
    return (
      <EmptyState
        title="No deletion history"
        description="Completed file deletions will appear here with their storage impact."
        icon={<HistoryOutlined />}
      />
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>File</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Storage Recovered</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Deleted At</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {history.map((item) => (
            <TableRow
              key={item.id}
              hover
            >
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    wordBreak: "break-word"
                  }}
                >
                  {item.filename}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {item.file_id}
                </Typography>
              </TableCell>

              <TableCell>
                {formatFileSize(
                  item.file_size
                )}
              </TableCell>

              <TableCell>
                <Chip
                  icon={<DeleteOutlined />}
                  label={formatFileSize(
                    item.storage_recovered
                  )}
                  color="success"
                  size="small"
                  variant="outlined"
                />
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {item.reason}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {formatDate(
                    item.deleted_at
                  )}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DeletionHistoryTable;