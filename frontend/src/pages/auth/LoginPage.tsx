import {
  Box,
  Card,
  CardContent,
  Link,
  Typography
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

function LoginPage() {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1
            }}
          >
            Welcome back
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Sign in to manage your files and optimize storage.
          </Typography>
        </Box>

        <LoginForm />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 3,
            textAlign: "center"
          }}
        >
          Don't have an account?{" "}
          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
          >
            Create an account
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default LoginPage;