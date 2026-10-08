import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import type { FileItem } from "../../types/file";
import FileRow from "./FileRow";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { EmptyState } from "../common/EmptyState";

interface FileTableProps {
  files: FileItem[];
  isLoading: boolean;
  onMetadata: (file: FileItem) => void;
  onDownload: (file: FileItem) => Promise<void>;
}

function FileTable({
  files,
  isLoading,
  onMetadata,
  onDownload
}: FileTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>File</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Uploaded</TableCell>
            <TableCell align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
              >
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : files.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
              >
                <EmptyState
                  title="No files found"
                  description="Upload a file or change your filters to see results."
                />
              </TableCell>
            </TableRow>
          ) : (
            files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onMetadata={onMetadata}
                onDownload={onDownload}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FileTable;