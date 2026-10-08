import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password
      });

      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to create account";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
    >
      <Stack spacing={2.5}>
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <TextField
          label="Full name"
          value={fullName}
          onChange={(event) =>
            setFullName(event.target.value)
          }
          required
          fullWidth
          autoComplete="name"
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
          fullWidth
          autoComplete="email"
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
          fullWidth
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={
            isSubmitting ||
            !fullName.trim() ||
            !email.trim() ||
            !password
          }
        >
          {isSubmitting ? (
            <CircularProgress
              size={24}
              color="inherit"
            />
          ) : (
            "Create Account"
          )}
        </Button>
      </Stack>
    </Box>
  );
}

export default RegisterForm;