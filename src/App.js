import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";
import PharmacyDashboard from "./PharmacyDashboard";

function App() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState("");

  // When login success
  const handleLogin = (userRole) => {
    setRole(userRole);
    setPage("dashboard");
  };

  // Show dashboard based on role
  if (page === "dashboard") {
    if (role === "doctor") return <DoctorDashboard />;
    if (role === "patient") return <PatientDashboard />;
    if (role === "pharmacy") return <PharmacyDashboard />;
  }

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      {page === "login" && (
        <>
          <Login onLogin={handleLogin} />
          <p>
            Don’t have an account?{" "}
            <button onClick={() => setPage("signup")}>Signup</button>
          </p>
        </>
      )}

      {page === "signup" && (
        <>
          <Signup />
          <p>
            Already have an account?{" "}
            <button onClick={() => setPage("login")}>Login</button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;
