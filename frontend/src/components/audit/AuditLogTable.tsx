import {
  EventNoteOutlined
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
import type { AuditLog } from "../../types/audit";
import { formatDate } from "../../utils/date";
import { EmptyState } from "../common/EmptyState";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading: boolean;
}

function AuditLogTable({
  logs,
  isLoading
}: AuditLogTableProps) {
  if (isLoading) {
    return (
      <LoadingSpinner
        message="Loading audit logs..."
      />
    );
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        title="No audit logs found"
        description="Security and file-management activities will appear here."
        icon={<EventNoteOutlined />}
      />
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>Entity</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>IP Address</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              hover
            >
              <TableCell>
                <Chip
                  label={log.action}
                  size="small"
                  color={
                    log.action.includes(
                      "DELETE"
                    )
                      ? "error"
                      : "primary"
                  }
                  variant="outlined"
                />
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  {log.entity_type}
                </Typography>

                {log.entity_id && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontFamily: "monospace"
                    }}
                  >
                    {log.entity_id}
                  </Typography>
                )}
              </TableCell>

              <TableCell>
                <Typography
                  component="pre"
                  variant="caption"
                  sx={{
                    m: 0,
                    maxWidth: 360,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontFamily: "monospace"
                  }}
                >
                  {log.details
                    ? JSON.stringify(
                        log.details
                      )
                    : "—"}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {log.ip_address ?? "—"}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {formatDate(
                    log.created_at
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

export default AuditLogTable;