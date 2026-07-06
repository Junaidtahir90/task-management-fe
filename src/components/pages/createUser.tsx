import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CreateUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await userApi.create(form);
      navigate("/");
    } catch (err) {
      
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card elevation={4}>
        <CardContent>

          <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
            Create User
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Enter the user information below.
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
                setForm({ ...form, name: e.target.value })
              }
            />

            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
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
                Create User
              </Button>
            </Box>

          </Stack>

        </CardContent>
      </Card>
    </Container>
  );
}