import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userApi } from "../../api/userApi";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // UI-only state — does not affect integration
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await userApi.getOne(id!);

        setForm({
          name: res.data.name,
          email: res.data.email,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await userApi.update(id!, form);
      navigate("/", {
        state: {
          message: "User updated successfully",
          severity: "success",
        },
      });
    } catch (err) {
      navigate("/", {
        state: {
          message: "Failed to update user",
          severity: "error",
        },
      });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Stack sx={{ alignItems: "center" }} spacing={2}>
          <CircularProgress size={32} />
          <Typography color="text.secondary">Loading user...</Typography>
        </Stack>
      </Container>
    );
  }

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
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 44,
                height: 44,
              }}
            >
              <EditIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                Edit user
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update the user information below
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
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Email address"
              type="email"
              fullWidth
              required
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
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
                {isSubmitting ? "Updating..." : "Update user"}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
