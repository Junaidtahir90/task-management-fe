import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";

import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveIcon from "@mui/icons-material/Save";

export default function CreateUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))  {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await userApi.create(formData);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ─── Shared TextField sx with label fix ───
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#fff",
      border: "2px solid #e5e7eb",
      py: 0.5,
      transition: "all 0.2s",
      "&:hover": { borderColor: "#d1d5db" },
      "&.Mui-focused": {
        borderColor: "#667eea",
        boxShadow: "0 0 0 4px rgba(102,126,234,0.1)",
      },
      "& fieldset": { border: "none" },
      "& legend": { display: "none" },
    },
    "& .MuiInputLabel-root": {
      color: "#6b7280",
      fontWeight: 500,
      fontSize: 14,
      transform: "translate(14px, 14px) scale(1)",
      transition: "all 0.2s ease",
    },
    "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled": {
      color: "#667eea",
      transform: "translate(14px, -10px) scale(0.75)",
      backgroundColor: "rgba(255,255,255,0.88)",
      padding: "0 6px",
      borderRadius: 1,
    },
    "& .MuiInputBase-input": {
      py: 1.2,
      fontSize: 14,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 5,
        px: { xs: 2, sm: 4 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 4,
              py: 3.5,
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 15px rgba(102,126,234,0.3)",
              }}
            >
              <PersonAddIcon sx={{ color: "#fff", fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#111827",
                  lineHeight: 1.2,
                  letterSpacing: -0.5,
                }}
              >
                Create User
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#6b7280", mt: 0.3, fontSize: 14 }}
              >
                {/* Enter the user information below */}
              </Typography>
            </Box>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ px: 4, py: 4 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Full name"
                value={formData.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                required
                sx={textFieldSx}
              />

              <TextField
                fullWidth
                label="Email address"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                required
                sx={textFieldSx}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                error={!!errors.password}
                helperText={errors.password}
                required
                sx={textFieldSx}
              />
            </Stack>

            {/* Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/")}
                sx={{
                  color: "#667eea",
                  borderColor: "#e5e7eb",
                  borderWidth: 2,
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#667eea",
                    backgroundColor: "rgba(102,126,234,0.05)",
                  },
                }}
              >
                Back
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)",
                    boxShadow: "0 6px 20px rgba(102,126,234,0.5)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    opacity: 0.6,
                  },
                }}
              >
                {loading ? "Creating..." : "Create User"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}



