import { SearchOutlined } from "@mui/icons-material";
import {
  InputAdornment,
  TextField
} from "@mui/material";

interface FileSearchProps {
  value: string;
  onChange: (value: string) => void;
}

function FileSearch({
  value,
  onChange
}: FileSearchProps) {
  return (
    <TextField
      fullWidth
      size="small"
      placeholder="Search files by filename..."
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined fontSize="small" />
            </InputAdornment>
          )
        }
      }}
    />
  );
}

export default FileSearch;