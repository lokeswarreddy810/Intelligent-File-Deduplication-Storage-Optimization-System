import {
  Box,
  Card,
  CardContent,
  Link,
  Typography
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";

function RegisterPage() {
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
            Create your account
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Start managing files and reducing duplicate storage.
          </Typography>
        </Box>

        <RegisterForm />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 3,
            textAlign: "center"
          }}
        >
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
          >
            Sign in
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default RegisterPage;