const SessionCard = ({ session }) => {
  const isPresent = session.statut === "P"

  return (
    <div className={`session-card ${isPresent ? "present" : "absent"}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "5px",
              color: "#333",
            }}
          >
            {session.nom}
          </h3>
          <p
            style={{
              color: "#666",
              marginBottom: "5px",
              fontSize: "0.95rem",
            }}
          >
            Date: {session.date}
          </p>
          <p
            style={{
              color: "#666",
              fontSize: "0.95rem",
            }}
          >
            Durée: {session.heures}h
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <span className={`status-badge ${isPresent ? "status-present" : "status-absent"}`}>
            {isPresent ? "Présent(e)" : "Absent(e)"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SessionCard
