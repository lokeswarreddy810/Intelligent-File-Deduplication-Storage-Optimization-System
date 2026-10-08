import {
  FilterAltOutlined,
  RestartAltOutlined
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField
} from "@mui/material";
import type { FileFilters as FileFilterState } from "../../types/file";

interface FileFiltersProps {
  filters: FileFilterState;
  onChange: (
    updates: Partial<FileFilterState>
  ) => void;
  onReset: () => void;
}

const extensions = [
  "pdf",
  "doc",
  "docx",
  "txt",
  "csv",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "zip",
  "rar",
  "7z"
];

function FileFilters({
  filters,
  onChange,
  onReset
}: FileFiltersProps) {
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))"
          },
          gap: 2
        }}
      >
        <TextField
          select
          size="small"
          label="File type"
          value={filters.extension}
          onChange={(event) =>
            onChange({
              extension: event.target.value
            })
          }
        >
          <MenuItem value="">
            All types
          </MenuItem>

          {extensions.map((extension) => (
            <MenuItem
              key={extension}
              value={extension}
            >
              .{extension}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          size="small"
          type="number"
          label="Minimum size (bytes)"
          value={filters.minSize}
          onChange={(event) =>
            onChange({
              minSize: event.target.value
            })
          }
          slotProps={{
            htmlInput: {
              min: 0
            }
          }}
        />

        <TextField
          size="small"
          type="number"
          label="Maximum size (bytes)"
          value={filters.maxSize}
          onChange={(event) =>
            onChange({
              maxSize: event.target.value
            })
          }
          slotProps={{
            htmlInput: {
              min: 0
            }
          }}
        />

        <TextField
          select
          size="small"
          label="Sort by"
          value={filters.sortBy}
          onChange={(event) =>
            onChange({
              sortBy:
                event.target.value as FileFilterState["sortBy"]
            })
          }
        >
          <MenuItem value="created_at">
            Upload date
          </MenuItem>

          <MenuItem value="updated_at">
            Updated date
          </MenuItem>

          <MenuItem value="filename">
            Filename
          </MenuItem>

          <MenuItem value="size">
            File size
          </MenuItem>

          <MenuItem value="extension">
            Extension
          </MenuItem>
        </TextField>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))"
          },
          gap: 2,
          alignItems: "center"
        }}
      >
        <TextField
          size="small"
          type="date"
          label="Start date"
          value={filters.startDate}
          onChange={(event) =>
            onChange({
              startDate: event.target.value
            })
          }
          slotProps={{
            inputLabel: {
              shrink: true
            }
          }}
        />

        <TextField
          size="small"
          type="date"
          label="End date"
          value={filters.endDate}
          onChange={(event) =>
            onChange({
              endDate: event.target.value
            })
          }
          slotProps={{
            inputLabel: {
              shrink: true
            }
          }}
        />

        <TextField
          select
          size="small"
          label="Sort order"
          value={filters.sortOrder}
          onChange={(event) =>
            onChange({
              sortOrder:
                event.target.value as FileFilterState["sortOrder"]
            })
          }
        >
          <MenuItem value="desc">
            Descending
          </MenuItem>

          <MenuItem value="asc">
            Ascending
          </MenuItem>
        </TextField>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: {
              xs: "space-between",
              sm: "flex-start"
            },
            gap: 1
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.duplicateOnly}
                onChange={(event) =>
                  onChange({
                    duplicateOnly:
                      event.target.checked
                  })
                }
              />
            }
            label="Duplicates only"
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <FilterAltOutlined
            fontSize="small"
            color="primary"
          />

          <Box
            component="span"
            sx={{
              fontSize: "0.85rem",
              color: "text.secondary"
            }}
          >
            Advanced filters
          </Box>
        </Box>

        <Button
          size="small"
          variant="text"
          startIcon={<RestartAltOutlined />}
          onClick={onReset}
        >
          Reset filters
        </Button>
      </Box>
    </Stack>
  );
}

export default FileFilters;