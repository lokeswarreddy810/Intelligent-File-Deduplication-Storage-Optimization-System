import {
  ArrowBackOutlined,
  BlockOutlined
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function UnauthorizedPage() {
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
                "rgba(239, 68, 68, 0.12)",
              color: "error.main"
            }}
          >
            <BlockOutlined fontSize="large" />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1
            }}
          >
            Access Denied
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mb: 3
            }}
          >
            You do not have permission to access
            this resource.
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

export default UnauthorizedPage;