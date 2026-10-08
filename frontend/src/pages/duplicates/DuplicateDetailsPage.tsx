import {
  ArrowBackOutlined,
  RefreshOutlined
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress
} from "@mui/material";
import {
  useNavigate,
  useParams
} from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import DuplicateDetails from "../../components/duplicates/DuplicateDetails";
import { useDuplicateDetails } from "../../hooks/useDuplicateDetails";

function DuplicateDetailsPage() {
  const navigate = useNavigate();

  const { groupId } = useParams<{
    groupId: string;
  }>();

  const {
    group,
    isLoading,
    error,
    refresh
  } = useDuplicateDetails(
    groupId ?? ""
  );

  if (!groupId) {
    return (
      <Alert severity="error">
        Duplicate group identifier is missing.
      </Alert>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Duplicate Group Details"
        description="Review the original file, duplicate files, content hash, and potential storage savings."
        action={
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap"
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlined />}
              onClick={() =>
                navigate("/duplicates")
              }
            >
              Back
            </Button>

            <Button
              variant="outlined"
              startIcon={
                isLoading ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                ) : (
                  <RefreshOutlined />
                )
              }
              onClick={() =>
                void refresh()
              }
              disabled={isLoading}
            >
              Refresh
            </Button>
          </Box>
        }
      />

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() =>
                void refresh()
              }
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {isLoading && !group && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {group && (
        <DuplicateDetails
          group={group}
        />
      )}
    </Box>
  );
}

export default DuplicateDetailsPage;