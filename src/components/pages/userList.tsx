import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";
import type { User } from "../../types/user";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SearchIcon from "@mui/icons-material/Search";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // UI-only state — client-side filter, no new API calls
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await userApi.getAll();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await userApi.remove(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query)
    );
  }, [users, search]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 34, height: 34, fontSize: 14 }}>
            {params.row.name?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography sx={{ fontWeight: 600 }}>
            {params.row.name}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      sortable: false,
      renderCell: () => (
        <Chip
          label="Active"
          color="success"
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit user">
            <IconButton
              size="small"
              onClick={() => navigate(`/edit/${params.row.id}`)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete user">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: "none" }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 44, height: 44 }}>
                <GroupOutlinedIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  User management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage access and roles for your team
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/create")}
            >
              Add user
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box sx={{ height: 450, width: "100%" }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              getRowId={(row) => row.id}
              loading={loading}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              sx={{
                border: 0,
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "grey.50",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
