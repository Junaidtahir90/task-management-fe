import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";
import type { User } from "../../types/user";

// MUI Components
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Fade,
  Skeleton,
} from "@mui/material";

// MUI Icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CircleIcon from "@mui/icons-material/Circle";

// ─── Gradient avatar helper ───
const getGradient = (name: string) => {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
};

const getInitials = (name: string) => {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// ─── Filter chip component ───
interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <Button
      onClick={onClick}
      sx={{
        px: 2.2,
        py: 0.8,
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        textTransform: "none",
        letterSpacing: 0.2,
        border: "2px solid",
        borderColor: active ? "transparent" : "#e5e7eb",
        background: active
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "#fff",
        color: active ? "#fff" : "#6b7280",
        boxShadow: active ? "0 4px 15px rgba(102,126,234,0.4)" : "none",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: active ? "transparent" : "#667eea",
          color: active ? "#fff" : "#667eea",
          background: active
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "rgba(102,126,234,0.05)",
          transform: "translateY(-1px)",
        },
      }}
    >
      {label}
    </Button>
  );
}

// ─── Status badge component ───
interface StatusBadgeProps {
  active: boolean;
}

function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <Chip
      icon={
        <CircleIcon
          sx={{
            width: 6,
            height: 6,
            color: active ? "#10b981" : "#ef4444",
            mr: -0.5,
          }}
        />
      }
      label={active ? "Active" : "Inactive"}
      size="small"
      sx={{
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 0.3,
        px: 0.5,
        py: 0.3,
        borderRadius: 999,
        backgroundColor: active ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
        color: active ? "#10b981" : "#ef4444",
        border: "none",
        "& .MuiChip-icon": {
          ml: 0.8,
        },
      }}
    />
  );
}

// ─── Main Component ───
export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const navigate = useNavigate();

  const filters = ["All", "Active", "Inactive"];

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
    let result = users;
    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query)
      );
    }

    // if (activeFilter === "Active") {
    //   result = result.filter((u) => u.status !== "inactive");
    // } else if (activeFilter === "Inactive") {
    //   result = result.filter((u) => u.status === "inactive");
    // }

    return result;
  }, [users, search, activeFilter]);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ─── Empty state ───
  const EmptyState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        color: "#9ca3af",
      }}
    >
      <GroupOutlinedIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#6b7280", mb: 0.5 }}>
        No users found
      </Typography>
  
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 5,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* ─── Glass Card ─── */}
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
          {/* ─── Header ─── */}
          <Box
            sx={{
              px: 4,
              py: 3.5,
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 4px 15px rgba(102,126,234,0.3)",
                }}
              >
                <GroupOutlinedIcon sx={{ color: "#fff", fontSize: 22 }} />
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
                  Team Members
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280", mt: 0.3, fontSize: 14 }}
                >
                  {/* Manage access and roles for your team */}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/create")}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                textTransform: "none",
                px: 3,
                py: 1,
                borderRadius: 999,
                boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)",
                  boxShadow: "0 6px 20px rgba(102,126,234,0.5)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Add User
            </Button>
          </Box>

          {/* ─── Search & Filters ─── */}
          <Box
            sx={{
              px: 4,
              py: 2.5,
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
              borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
            }}
          >
            <TextField
              size="small"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              sx={{
                flex: 1,
                minWidth: 260,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  backgroundColor: "#fff",
                  border: "2px solid #e5e7eb",
                  transition: "all 0.2s",
                  pl: 1,
                  "&:hover": {
                    borderColor: "#d1d5db",
                  },
                  "&.Mui-focused": {
                    borderColor: "#667eea",
                    boxShadow: "0 0 0 4px rgba(102,126,234,0.1)",
                  },
                  "& fieldset": { border: "none" },
                },
                "& .MuiInputBase-input": {
                  fontSize: 14,
                  py: 1.2,
                  "&::placeholder": {
                    color: "#9ca3af",
                    opacity: 1,
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0.5 }}>
                      <SearchIcon
                        sx={{ color: "#9ca3af", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {filters.map((f) => (
                <FilterChip
                  key={f}
                  label={f}
                  active={activeFilter === f}
                  onClick={() => {
                    setActiveFilter(f);
                    setPage(0);
                  }}
                />
              ))}
            </Stack> */}
          </Box>

          {/* ─── Table ─── */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                  }}
                >
                  {["Name", "Email", "Status", "Actions"].map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#9ca3af",
                        borderBottom: "none",
                        ...(head === "Actions" && { textAlign: "right" }),
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ px: 4, py: 2 }}>
                        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                          <Skeleton variant="circular" width={40} height={40} />
                          <Skeleton variant="text" width={120} height={24} />
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ px: 4, py: 2 }}>
                        <Skeleton variant="text" width={180} height={20} />
                      </TableCell>
                      <TableCell sx={{ px: 4, py: 2 }}>
                        <Skeleton variant="text" width={70} height={24} />
                      </TableCell>
                      <TableCell sx={{ px: 4, py: 2, textAlign: "right" }}>
                        <Skeleton variant="text" width={60} height={24} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <EmptyState />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      onMouseEnter={() => setHoveredRow(user.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      sx={{
                        transition: "background-color 0.2s",
                        backgroundColor:
                          hoveredRow === user.id
                            ? "rgba(102,126,234,0.03)"
                            : "transparent",
                        "& td": {
                          borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                          py: 2,
                          px: 4,
                        },
                      }}
                    >
                      {/* Name Cell */}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                          <Box sx={{ position: "relative" }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#fff",
                                background: getGradient(user.name || ""),
                              }}
                            >
                              {getInitials(user.name || "")}
                            </Avatar>
                            {//user.status !== "inactive" && 
                            (
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: 2,
                                  right: 2,
                                  width: 10,
                                  height: 10,
                                  backgroundColor: "#10b981",
                                  border: "2px solid #fff",
                                  borderRadius: "50%",
                                }}
                              />
                            )}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#111827",
                              lineHeight: 1.3,
                            }}
                          >
                            {user.name}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Email */}
                      <TableCell>
                        <Typography
                          sx={{ fontSize: 14, color: "#4b5563" }}
                        >
                          {user.email}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge active />
                      </TableCell>

                      {/* Actions */}
                      {/* <TableCell sx={{ textAlign: "right" }}>
                        <Fade in={hoveredRow === user.id}>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ justifyContent: "flex-end" }}
                          >
                            <Tooltip title="Edit user" arrow>
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/edit/${user.id}`)}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 1.5,
                                  border: "1px solid #e5e7eb",
                                  backgroundColor: "#fff",
                                  color: "#9ca3af",
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    backgroundColor: "#f9fafb",
                                    color: "#374151",
                                    borderColor: "#d1d5db",
                                  },
                                }}
                              >
                                <EditIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete user" arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(user.id)}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 1.5,
                                  border: "1px solid #e5e7eb",
                                  backgroundColor: "#fff",
                                  color: "#9ca3af",
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    backgroundColor: "rgba(239,68,68,0.1)",
                                    color: "#ef4444",
                                    borderColor: "#ef4444",
                                  },
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Fade>
                      </TableCell> */}
                      {/* Actions */}
<TableCell sx={{ textAlign: "right" }}>
  <Stack
    direction="row"
    spacing={1}
    sx={{ justifyContent: "flex-end" }}
  >
    <Tooltip title="Edit user" arrow>
      <IconButton
        size="small"
        onClick={() => navigate(`/edit/${user.id}`)}
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1.5,
          border: "1px solid #e5e7eb",
          backgroundColor: "#fff",
          color: "#9ca3af",
          transition: "all 0.2s",
          "&:hover": {
            backgroundColor: "#f9fafb",
            color: "#374151",
            borderColor: "#d1d5db",
          },
        }}
      >
        <EditIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Tooltip>

    <Tooltip title="Delete user" arrow>
      <IconButton
        size="small"
        onClick={() => handleDelete(user.id)}
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1.5,
          border: "1px solid #e5e7eb",
          backgroundColor: "#fff",
          color: "#9ca3af",
          transition: "all 0.2s",
          "&:hover": {
            backgroundColor: "rgba(239,68,68,0.1)",
            color: "#ef4444",
            borderColor: "#ef4444",
          },
        }}
      >
        <DeleteIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Tooltip>
  </Stack>
</TableCell>
  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ─── Pagination ─── */}
          <Box
            sx={{
              px: 4,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(0, 0, 0, 0.04)",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              sx={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}
            >
              Showing{" "}
              <strong style={{ color: "#111827" }}>
                {filteredUsers.length > 0
                  ? `${page * rowsPerPage + 1}-${Math.min(
                      (page + 1) * rowsPerPage,
                      filteredUsers.length
                    )}`
                  : "0"}
              </strong>{" "}
              of{" "}
              <strong style={{ color: "#111827" }}>
                {filteredUsers.length}
              </strong>{" "}
              users
            </Typography>

            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              sx={{
                border: "none",
                "& .MuiTablePagination-toolbar": {
                  px: 0,
                  minHeight: 40,
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    fontSize: 13,
                    color: "#6b7280",
                    fontWeight: 500,
                  },
                "& .MuiTablePagination-select": {
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#111827",
                },
                "& .MuiTablePagination-actions": {
                  "& button": {
                    borderRadius: 1.5,
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#fff",
                    color: "#6b7280",
                    mx: 0.3,
                    transition: "all 0.2s",
                    "&:hover:not(:disabled)": {
                      backgroundColor: "#f9fafb",
                      borderColor: "#d1d5db",
                    },
                    "&:disabled": {
                      opacity: 0.4,
                    },
                  },
                },
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}