import { useState } from "react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const API = process.env.REACT_APP_API_URL;

 // ⭐ Use backend from .env

  const signupUser = () => {
    fetch(`${API}/api/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message || "Signup completed"))
      .catch((err) => {
        console.error(err);
        alert("Network error. Please try again.");
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #d4e8ff, #ffffff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px 25px",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.5)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.3)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 20, color: "#004b96" }}>Create Account</h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 15,
            borderRadius: 8,
            border: "1px solid #aac4e6",
          }}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 15,
            borderRadius: 8,
            border: "1px solid #aac4e6",
          }}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 15,
            borderRadius: 8,
            border: "1px solid #aac4e6",
          }}
        />

        <select
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 20,
            borderRadius: 8,
            border: "1px solid #aac4e6",
          }}
        >
          <option value="">Select Role</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
          <option value="pharmacy">Pharmacy</option>
        </select>

        <button
          onClick={signupUser}
          style={{
            width: "100%",
            background: "#0057d9",
            padding: "12px 0",
            borderRadius: 8,
            color: "white",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: 5,
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Signup;
