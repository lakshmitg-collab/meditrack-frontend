import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = () => {
   const API = process.env.REACT_APP_API_URL || "https://meditrack-backend-one.vercel.app";


 // ⭐ Load from .env

    fetch(`${API}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.role) {
          localStorage.setItem("user", JSON.stringify(data));
          alert("Login successful!");
          onLogin(data.role);
        } else {
          alert(data.error || "Login failed");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Network error. Please try again.");
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #c8f7dc, #e8fffb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "360px",
          padding: "35px 28px",
          borderRadius: "18px",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.55)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          border: "1px solid rgba(255,255,255,0.7)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: 22,
            color: "#0fb9b1",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          Login
        </h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 16,
            borderRadius: 10,
            border: "1px solid #9be4cc",
            outline: "none",
            fontSize: "15px",
          }}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 16,
            borderRadius: 10,
            border: "1px solid #9be4cc",
            outline: "none",
            fontSize: "15px",
          }}
        />

        <button
          onClick={loginUser}
          style={{
            width: "100%",
            background: "#0fb9b1",
            padding: "12px 0",
            borderRadius: 10,
            color: "white",
            border: "none",
            fontSize: "17px",
            cursor: "pointer",
            fontWeight: "600",
            letterSpacing: "0.5px",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#1dd1a1")}
          onMouseOut={(e) => (e.target.style.background = "#0fb9b1")}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
