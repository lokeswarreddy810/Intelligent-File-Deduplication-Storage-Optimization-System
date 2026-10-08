import {
  ArrowBackOutlined,
  SearchOffOutlined
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 520,
          textAlign: "center"
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              mx: "auto",
              mb: 2,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                "rgba(99, 102, 241, 0.12)",
              color: "primary.main"
            }}
          >
            <SearchOffOutlined fontSize="large" />
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1
            }}
          >
            404
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mb: 3
            }}
          >
            The page you requested does not
            exist or may have been moved.
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBackOutlined />}
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NotFoundPage;