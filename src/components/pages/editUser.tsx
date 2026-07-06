import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userApi } from "../../api/userApi";

export default function EditUser() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {

    const loadUser = async () => {

      const res = await userApi.getOne(id!);

      setForm({
        name: res.data.name,
        email: res.data.email,
      });

    };

    loadUser();

  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    await userApi.update(id!, form);

    navigate("/");

  };

  return (

    <form onSubmit={handleSubmit}>

      <input
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <button type="submit">
        Update
      </button>

    </form>

  );
}