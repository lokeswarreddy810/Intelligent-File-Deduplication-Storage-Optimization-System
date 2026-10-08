import {
  AddOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent
} from "@mui/material";
import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import FileFilters from "../../components/files/FileFilters";
import FileMetadataDialog from "../../components/files/FileMetadataDialog";
import FilePagination from "../../components/files/FilePagination";
import FileSearch from "../../components/files/FileSearch";
import FileTable from "../../components/files/FileTable";
import FileUploadDialog from "../../components/files/FileUploadDialog";
import { useFiles } from "../../hooks/useFiles";
import type { FileItem } from "../../types/file";
import { fileService } from "../../services/fileService";

function FilesPage() {
  const {
    files,
    total,
    totalPages,
    currentPage,
    pageSize,
    filters,
    isLoading,
    isUploading,
    error,
    setPage,
    setPageSize,
    updateFilters,
    resetFilters,
    upload
  } = useFiles();

  const [uploadOpen, setUploadOpen] =
    useState(false);

  const [metadataFile, setMetadataFile] =
    useState<FileItem | null>(null);

  const [downloadError, setDownloadError] =
    useState<string | null>(null);

  const handleDownload = async (
    file: FileItem
  ) => {
    setDownloadError(null);

    try {
      await fileService.download(file);
    } catch {
      setDownloadError(
        "Unable to download the selected file."
      );
    }
  };

  return (
    <Box>
      <PageHeader
        title="Files"
        description="Manage your uploaded files, search storage, and inspect file metadata."
        action={
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() =>
              setUploadOpen(true)
            }
          >
            Upload File
          </Button>
        }
      />

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {downloadError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() =>
            setDownloadError(null)
          }
        >
          {downloadError}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <FileSearch
              value={filters.search}
              onChange={(value) =>
                updateFilters({
                  search: value
                })
              }
            />
          </Box>

          <FileFilters
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <FileTable
            files={files}
            isLoading={isLoading}
            onMetadata={setMetadataFile}
            onDownload={handleDownload}
          />

          <FilePagination
            page={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
          />
        </CardContent>
      </Card>

      <FileUploadDialog
        open={uploadOpen}
        onClose={() =>
          setUploadOpen(false)
        }
        onUpload={async (file) => {
          await upload(file);
        }}
        isUploading={isUploading}
      />

      <FileMetadataDialog
        file={metadataFile}
        onClose={() =>
          setMetadataFile(null)
        }
      />
    </Box>
  );
}

export default FilesPage;