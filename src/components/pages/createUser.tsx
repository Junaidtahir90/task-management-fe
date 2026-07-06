import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonIcon from "@mui/icons-material/Person";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function CreateUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // UI-only state — does not affect integration
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await userApi.create(form);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: "center" }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 44,
                height: 44,
              }}
            >
              <PersonAddAltIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                Create user
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter the user information below
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
            <TextField
              label="Full name"
              fullWidth
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              {...({
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              } as any)}
            />

            <TextField
              label="Email address"
              type="email"
              fullWidth
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              {...({
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              } as any)}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              {...({
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              } as any)}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 1.5,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/")}
                disabled={isSubmitting}
              >
                Back
              </Button>

              <Button
                variant="contained"
                type="submit"
                startIcon={<SaveIcon />}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create user"}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
