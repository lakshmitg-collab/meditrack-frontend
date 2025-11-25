import { useEffect, useState, useCallback } from "react";

export default function PharmacyDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [newName, setNewName] = useState("");
  const [newManufacturer, setNewManufacturer] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  const [searchMedicine, setSearchMedicine] = useState("");
  const [searchPrescription, setSearchPrescription] = useState("");

  const [showPrescriptions, setShowPrescriptions] = useState(false);

 const API = process.env.REACT_APP_API_URL || "https://meditrack-backend-one.vercel.app";




  // LOAD DATA
  const load = useCallback(() => {
    fetch(`${API}/api/medicines`)
      .then((res) => res.json())
      .then(setMedicines)
      .catch(console.error);

    fetch(`${API}/api/prescriptions`)
      .then((res) => res.json())
      .then(setPrescriptions)
      .catch(console.error);
  }, [API]);

  useEffect(() => {
    load();
  }, [load]);

  // ADD MEDICINE WITH VALIDATION + RESET
  const addMedicine = () => {
    if (!newName || !newManufacturer || !newPrice || !newQuantity) {
      alert("Please fill all fields!");
      return;
    }

    fetch(`${API}/api/medicines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        manufacturer: newManufacturer,
        price: newPrice,
        quantity: newQuantity,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Medicine Added!");
        load();

        // reset fields
        setNewName("");
        setNewManufacturer("");
        setNewPrice("");
        setNewQuantity("");
      })
      .catch(console.error);
  };

  // DELETE
  const deleteMedicine = (id) => {
    fetch(`${API}/api/medicines/${id}`, { method: "DELETE" }).then(() => {
      alert("Medicine Deleted!");
      load();
    });
  };

  const inStock = (name) => {
    const found = medicines.find(
      (m) => m.name?.toLowerCase() === name.toLowerCase()
    );
    if (!found) return null;
    return found.quantity > 0
      ? { ok: true, qty: found.quantity }
      : { ok: false, qty: 0 };
  };

  const filteredMedicines = medicines.filter((m) =>
    m.name?.toLowerCase().includes(searchMedicine.toLowerCase())
  );

  const filteredPrescriptions = prescriptions.filter((p) => {
    const t = searchPrescription.toLowerCase();
    return (
      p.patientName?.toLowerCase().includes(t) ||
      p.doctorId?.name?.toLowerCase().includes(t) ||
      p.medicines.some((m) => m.name?.toLowerCase().includes(t))
    );
  });

  return (
    <div style={{ maxWidth: 1150, margin: "20px auto", padding: 10 }}>
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #fff8e6, #fff)",
          padding: "20px 25px",
          borderRadius: "12px",
          border: "1px solid #ffe2a3",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: 30,
        }}
      >
        <h2 style={{ margin: 0, fontSize: "26px", color: "#d48806" }}>
          🏥 Pharmacy Dashboard
        </h2>
        <p style={{ margin: 0, color: "#996c00" }}>
          Manage medicine stock & view prescriptions
        </p>
      </div>

      {/* ADD MEDICINE FORM */}
      <div
        style={{
          background: "#ffffff",
          padding: 20,
          borderRadius: 10,
          marginBottom: 30,
          border: "1px solid #e0e0e0",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <h3>Add New Medicine Stock</h3>

        <input
          placeholder="Medicine Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #bbb",
            marginBottom: 10,
          }}
        />

        <input
          placeholder="Manufacturer"
          value={newManufacturer}
          onChange={(e) => setNewManufacturer(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #bbb",
            marginBottom: 10,
          }}
        />

        <input
          placeholder="Price"
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #bbb",
            marginBottom: 10,
          }}
        />

        <input
          placeholder="Quantity"
          type="number"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #bbb",
            marginBottom: 10,
          }}
        />

        <button
          onClick={addMedicine}
          style={{
            background: "#d48806",
            color: "white",
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          ➕ Add Medicine
        </button>
      </div>

      {/* SEARCH MEDICINES */}
      <input
        type="text"
        placeholder="Search medicines..."
        value={searchMedicine}
        onChange={(e) => setSearchMedicine(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          border: "1px solid #bbb",
          marginBottom: 20,
        }}
      />

      {/* MEDICINE LIST */}
      <h2 style={{ color: "#d48806" }}>📦 Medicine Stock</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {filteredMedicines.map((m) => (
          <div
            key={m._id}
            style={{
              border: "1px solid #ffd27f",
              padding: 15,
              borderRadius: 10,
              background: "#fffaf0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: "5px 0" }}>{m.name}</h3>
            <p>Manufacturer: {m.manufacturer}</p>
            <p>
              Quantity: <strong>{m.quantity}</strong>
            </p>
            <p>
              Price: <strong>₹{m.price}</strong>
            </p>

            <button
              onClick={() => deleteMedicine(m._id)}
              style={{
                marginTop: 10,
                background: "red",
                color: "white",
                padding: "6px 10px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* SEARCH PRESCRIPTIONS */}
      <input
        type="text"
        placeholder="Search prescriptions (doctor, patient, medicine)..."
        value={searchPrescription}
        onChange={(e) => setSearchPrescription(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          border: "1px solid #bbb",
          marginBottom: 20,
        }}
      />

      {/* PRESCRIPTION TOGGLE */}
      <h2 style={{ color: "#d48806" }}>📄 Medicines in Prescriptions</h2>

      <button
        onClick={() => setShowPrescriptions(!showPrescriptions)}
        style={{
          background: "#d48806",
          color: "white",
          padding: "10px 18px",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: 15,
        }}
      >
        {showPrescriptions ? "Hide Prescriptions" : "Show Prescriptions"}
      </button>

      {showPrescriptions && (
        <div>
          {filteredPrescriptions.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                borderRadius: 10,
                marginBottom: 15,
                background: "#fdfdfd",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <p>
                <strong>Patient:</strong> {p.patientName}
              </p>
              <p>
                <strong>Doctor:</strong> {p.doctorId?.name || "Unknown"}
              </p>

              <ul>
                {p.medicines.map((m, i) => {
                  const s = inStock(m.name);
                  return (
                    <li key={i} style={{ marginBottom: 5 }}>
                      <strong>{m.name}</strong> — {m.dosage} —{" "}
                      {m.instructions}{" "}
                      |{" "}
                      {s === null ? (
                        <span style={{ color: "gray" }}>Not in system</span>
                      ) : s.ok ? (
                        <span style={{ color: "green" }}>
                          In Stock ({s.qty})
                        </span>
                      ) : (
                        <span style={{ color: "red" }}>Out of Stock</span>
                      )}
                    </li>
                  );
                })}
              </ul>

              {p.uploadedFile && (
                <a
                  href={`${API}${p.uploadedFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: "bold", color: "#0057b8" }}
                >
                  📄 View Uploaded Prescription
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
