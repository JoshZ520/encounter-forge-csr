import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to Encounter Forge</h1>
      <p>You are logged in as: <strong>{user?.email}</strong></p>
      
      <div style={{ marginTop: "20px" }}>
        <h2>Encounter Features Coming Soon:</h2>
        <ul>
          <li>Create encounters</li>
          <li>View your encounters</li>
          <li>Edit encounter details</li>
          <li>Delete encounters</li>
          <li>Add monsters to encounters</li>
        </ul>
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Logout
      </button>
    </div>
  );
}
