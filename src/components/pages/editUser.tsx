import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userApi } from "../../api/userApi";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

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

    try {
      await userApi.update(id!, form);
       navigate("/", {
    state: {
    message: "User updated successfully",
    severity: "success",
  }})
    } catch (err) {
        navigate("/", {
    state: {
    message: "Failed to update user",
    severity: "error",
  }})
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Stack sx={{ alignItems: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading user...</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card elevation={4}>
        <CardContent>

          <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
            Edit User
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Update the user information below.
          </Typography>

          <Stack
            component="form"
            spacing={3}
            onSubmit={handleSubmit}
          >

            <TextField
              label="Full Name"
              fullWidth
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <TextField
              label="Email Address"
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
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/")}
              >
                Back
              </Button>

              <Button
                variant="contained"
                type="submit"
                startIcon={<SaveIcon />}
              >
                Update User
              </Button>
            </Box>

          </Stack>

        </CardContent>
      </Card>
    </Container>
  );
}