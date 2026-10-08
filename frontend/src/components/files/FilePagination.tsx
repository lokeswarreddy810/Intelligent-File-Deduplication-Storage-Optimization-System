import {
  Box,
  MenuItem,
  Pagination,
  Select,
  Typography
} from "@mui/material";

interface FilePaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function FilePagination({
  page,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange
}: FilePaginationProps) {
  return (
    <Box
      sx={{
        px: 2,
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap"
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {total.toLocaleString("en-IN")} file
        {total === 1 ? "" : "s"}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2
        }}
      >
        <Select
          size="small"
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(
              Number(event.target.value)
            )
          }
        >
          <MenuItem value={10}>10 / page</MenuItem>
          <MenuItem value={20}>20 / page</MenuItem>
          <MenuItem value={50}>50 / page</MenuItem>
          <MenuItem value={100}>100 / page</MenuItem>
        </Select>

        {totalPages > 1 && (
          <Pagination
            page={page}
            count={totalPages}
            onChange={(_, value) =>
              onPageChange(value)
            }
            color="primary"
            shape="rounded"
          />
        )}
      </Box>
    </Box>
  );
}

export default FilePagination;