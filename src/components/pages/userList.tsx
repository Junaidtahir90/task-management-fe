import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";
import type { User } from "../../types/user";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll();
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    await userApi.remove(id);
    fetchUsers();
  };

  return (
    <div>

      <h2>Users</h2>

      <button onClick={() => navigate("/create")}>
        Add User
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.name} ({u.email})

              <button onClick={() => navigate(`/edit/${u.id}`)}>
                Edit
              </button>

              <button onClick={() => handleDelete(u.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}