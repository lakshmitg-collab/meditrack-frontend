import { useState, useEffect, useCallback } from "react";

export default function DoctorDashboard() {
  const [patientName, setPatientName] = useState("");
  const [rows, setRows] = useState([{ name: "", dosage: "", instructions: "" }]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const [doctorId, setDoctorId] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [doctorPrescriptions, setDoctorPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const API = process.env.REACT_APP_API_URL;

  // ⭐ useCallback prevents ESLint warning
  const loadDoctorPrescriptions = useCallback(
    async (id) => {
      const res = await fetch(`${API}/api/prescriptions?doctorId=${id}`);
      const data = await res.json();
      setDoctorPrescriptions(data);
    },
    [API]
  );

  // LOAD LOGGED IN DOCTOR
  useEffect(() => {
    const logged = JSON.parse(localStorage.getItem("user"));
    if (logged && logged._id) {
      setDoctorId(logged._id);
      setDoctorName(logged.name);
      loadDoctorPrescriptions(logged._id);
    } else {
      alert("Doctor not logged in");
    }
  }, [loadDoctorPrescriptions]);

  const addRow = () =>
    setRows([...rows, { name: "", dosage: "", instructions: "" }]);

  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  const setRow = (i, field, val) => {
    const updated = [...rows];
    updated[i][field] = val;
    setRows(updated);
  };

  // SUBMIT PRESCRIPTION
  const submitPrescription = async (e) => {
    e.preventDefault();

    if (!doctorId) return alert("Doctor not logged in");
    if (!patientName.trim()) return alert("Enter patient name");

    const validRows = rows.filter((r) => r.name.trim());
    if (validRows.length === 0) return alert("Add at least one medicine");

    const form = new FormData();
    form.append("doctorId", doctorId);
    form.append("patientName", patientName.trim());
    form.append("medicines", JSON.stringify(validRows));
    if (file) form.append("file", file);

    setMessage("Submitting...");

    const res = await fetch(`${API}/api/prescriptions`, {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (data._id) {
      setMessage("Prescription submitted ✔");
      setPatientName("");
      setRows([{ name: "", dosage: "", instructions: "" }]);
      setFile(null);
      loadDoctorPrescriptions(doctorId);
    } else {
      setMessage("Error submitting");
    }
  };

  const filteredPrescriptions = doctorPrescriptions.filter((p) => {
    const t = searchTerm.toLowerCase();
    return (
      p.patientName.toLowerCase().includes(t) ||
      new Date(p.createdAt).toLocaleString().toLowerCase().includes(t)
    );
  });

  return (
    <div style={{ maxWidth: 950, margin: "20px auto", padding: 20 }}>
      {/* HEADER */}
      <div
        style={{
          background: "#e9f2ff",
          padding: "20px 25px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: 30,
          border: "1px solid #c8daf7",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "26px" }}>👨‍⚕️ Doctor Dashboard</h2>
        <p style={{ margin: "5px 0 0 0", fontSize: "18px", color: "#0057b8" }}>
          Welcome, <strong>{doctorName}</strong>
        </p>
      </div>

      {/* FORM */}
      <div
        style={{
          background: "#ffffff",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0",
          marginBottom: 30,
        }}
      >
        <h3>📝 Create Prescription</h3>

        <form onSubmit={submitPrescription}>
          <label style={{ fontWeight: "bold" }}>Patient Name</label>
          <input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
            style={{
              width: "100%",
              padding: 10,
              margin: "8px 0 20px",
              borderRadius: 6,
              border: "1px solid #999",
            }}
          />

          <h3>💊 Medicines</h3>

          <button
            type="button"
            onClick={addRow}
            style={{
              padding: "6px 12px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 6,
              marginBottom: 15,
              cursor: "pointer",
            }}
          >
            + Add Row
          </button>

          {rows.map((r, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 80px",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <input
                placeholder="Name"
                value={r.name}
                onChange={(e) => setRow(i, "name", e.target.value)}
                style={{ padding: 8, borderRadius: 6, border: "1px solid #aaa" }}
              />
              <input
                placeholder="Dosage"
                value={r.dosage}
                onChange={(e) => setRow(i, "dosage", e.target.value)}
                style={{ padding: 8, borderRadius: 6, border: "1px solid #aaa" }}
              />
              <input
                placeholder="Instructions"
                value={r.instructions}
                onChange={(e) => setRow(i, "instructions", e.target.value)}
                style={{ padding: 8, borderRadius: 6, border: "1px solid #aaa" }}
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                style={{
                  background: "red",
                  color: "white",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}

          <label style={{ fontWeight: "bold" }}>Upload File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ margin: "10px 0 20px" }}
          />

          <button
            type="submit"
            style={{
              background: "green",
              color: "white",
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit Prescription
          </button>
        </form>

        <p style={{ marginTop: 10, color: "purple" }}>{message}</p>
      </div>

      {/* PAST PRESCRIPTIONS */}
      <input
        type="text"
        placeholder="Search past prescriptions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          border: "1px solid #bbb",
          marginBottom: 20,
        }}
      />

      <h2>Your Past Prescriptions</h2>

      {filteredPrescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        filteredPrescriptions.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              borderRadius: 10,
              background: "#f9f9f9",
              marginBottom: 12,
            }}
          >
            <p>
              <strong>Patient:</strong> {p.patientName}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(p.createdAt).toLocaleString()}
            </p>

            {p.uploadedFile && (
              <a
                href={`${API}${p.uploadedFile}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0066cc", fontWeight: "bold" }}
              >
                📄 View File
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}
