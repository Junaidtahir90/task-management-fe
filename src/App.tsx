import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserList from "./components/pages/userList";
import CreateUser from "./components/pages/createUser";
import EditUser from "./components/pages/editUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/create" element={<CreateUser />} />
        <Route path="/edit/:id" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;