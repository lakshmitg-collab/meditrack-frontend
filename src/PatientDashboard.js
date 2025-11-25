import { useEffect, useState } from "react";

export default function PatientDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ⭐ Logged-in patient
  const logged = JSON.parse(localStorage.getItem("user"));
  const loggedName = logged?.name?.trim()?.toLowerCase();

  const API = process.env.REACT_APP_API_URL;



  useEffect(() => {
    // FETCH ALL PRESCRIPTIONS
    fetch(`${API}/api/prescriptions`)
      .then((r) => r.json())
      .then(setPrescriptions);

    // FETCH STOCK
    fetch(`${API}/api/medicines`)
      .then((r) => r.json())
      .then(setMedicines);
  }, [API]);

  // ⭐ STOCK CHECK
  const checkStock = (name) => {
    const m = medicines.find(
      (x) => x.name?.toLowerCase() === name?.toLowerCase()
    );
    if (!m) return "❌ Not in database";
    if (m.quantity > 0) return `✅ In stock (Qty: ${m.quantity})`;
    return "❌ Out of stock";
  };

  // ⭐ CLEAN VALID PRESCRIPTIONS ONLY
  const cleanPrescriptions = prescriptions.filter(
    (p) =>
      p.doctorId?.name &&
      p.patientName &&
      Array.isArray(p.medicines) &&
      p.medicines.length > 0
  );

  // ⭐ YOUR PRESCRIPTIONS
  const myPrescriptions = cleanPrescriptions
    .filter((p) => p.patientName?.trim()?.toLowerCase() === loggedName)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // ⭐ OTHER PRESCRIPTIONS
  const otherPrescriptions = cleanPrescriptions.filter(
    (p) => p.patientName?.trim()?.toLowerCase() !== loggedName
  );

  // ⭐ SEARCH FILTER
  const filteredMyPrescriptions = myPrescriptions.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.doctorId?.name?.toLowerCase().includes(term) ||
      p.medicines.some((m) => m.name?.toLowerCase().includes(term)) ||
      new Date(p.createdAt).toLocaleString().toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>

      {/* 🌈 BEAUTIFUL PROFILE HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #dff1ff, #ffffff)",
          padding: "20px 25px",
          borderRadius: "12px",
          border: "1px solid #c7daff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: 25,
        }}
      >
        <h2 style={{ margin: 0, fontSize: "26px", color: "#004b96" }}>
          👤 Welcome, {logged?.name}
        </h2>
        <p style={{ margin: 0, fontSize: "15px", color: "#3b5d80" }}>
          Your personal prescription & medicine overview
        </p>
      </div>

      <h1 style={{ margin: "10px 0", color: "#004b96" }}>
        Patient Dashboard
      </h1>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search your prescriptions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #8daed6",
          margin: "15px 0 25px",
          fontSize: "15px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      />

      {/* ⭐ YOUR PRESCRIPTIONS */}
      <h2 style={{ color: "green", marginBottom: 10 }}>
        💊 Your Prescriptions
      </h2>

      {filteredMyPrescriptions.length === 0 ? (
        <p>No matching prescriptions.</p>
      ) : (
        filteredMyPrescriptions.map((p) => (
          <div
            key={p._id}
            style={{
              background: "#eaffe2",
              borderLeft: "6px solid #33aa22",
              padding: 15,
              marginBottom: 15,
              borderRadius: 10,
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              transition: "0.2s",
            }}
          >
            <div><strong>Doctor:</strong> {p.doctorId?.name}</div>
            <div><strong>Patient:</strong> {p.patientName}</div>
            <div>
              <strong>Date:</strong>{" "}
              {new Date(p.createdAt).toLocaleString()}
            </div>

            <h4 style={{ marginTop: 12 }}>Prescribed Medicines</h4>
            <ul style={{ marginLeft: 20 }}>
              {p.medicines.map((m, i) => (
                <li key={i} style={{ marginBottom: 5 }}>
                  <strong>{m.name}</strong>
                  {m.dosage ? ` — ${m.dosage}` : ""}
                  {m.instructions ? ` — ${m.instructions}` : ""}
                  <br />
                  <span style={{ color: "#005ce6" }}>{checkStock(m.name)}</span>
                </li>
              ))}
            </ul>

            {p.uploadedFile && (
              <a
                href={`${API}${p.uploadedFile}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff", fontWeight: "bold" }}
              >
                📄 View Handwritten Prescription
              </a>
            )}
          </div>
        ))
      )}

      <hr style={{ margin: "35px 0", opacity: 0.3 }} />

      {/* ⭐ OTHER PRESCRIPTIONS */}
      <h2 style={{ marginBottom: 10, color: "#444" }}>
        👥 Other Patients’ Prescriptions
      </h2>

      {otherPrescriptions.map((p) => (
        <div
          key={p._id}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            borderRadius: 10,
            background: "#fafafa",
            marginBottom: 12,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <div><strong>Doctor:</strong> {p.doctorId?.name}</div>
          <div><strong>Patient:</strong> {p.patientName}</div>
          <div>
            <strong>Date:</strong>{" "}
            {new Date(p.createdAt).toLocaleString()}
          </div>

          <h4>Medicines</h4>
          <ul style={{ marginLeft: 20 }}>
            {p.medicines.map((m, i) => (
              <li key={i}>{m.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
