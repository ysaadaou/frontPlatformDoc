"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Timer from "./Timer"
import SessionCard from "./SessionCard"
import StudentInfo from "./StudentInfo"
import CertificateSection from "./CertificateSection"

const Dashboard = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedData = localStorage.getItem("userData")
        if (storedData) {
          setUserData(JSON.parse(storedData))
        } else {
          navigate("/login")
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    navigate("/login")
  }

  const handleSessionTimeout = () => {
    handleLogout()
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  const sessions = [
    {
      id: 1,
      nom: "Session 1",
      date: "21/07/2025",
      heures: 5,
      statut: userData.sessions?.s1 || "absent",
    },
    {
      id: 2,
      nom: "Session 2",
      date: "23/07/2025",
      heures: 5,
      statut: userData.sessions?.s2 || "absent",
    },
    {
      id: 3,
      nom: "Session 3",
      date: "24/07/2025",
      heures: 5,
      statut: userData.sessions?.s3 || "absent",
    },
  ]

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "40px" }}>
      <Timer onTimeout={handleSessionTimeout} />

      <div className="container" style={{ paddingTop: "40px" }}>
        <header className="card p-30 mb-20" style={{ position: "relative" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "25px 60px 25px 20px", // Add right padding for logout button space
              background: "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)",
              borderRadius: "15px",
              border: "1px solid rgba(102, 126, 234, 0.1)",
            }}
          >
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "15px",
                lineHeight: "1.2",
              }}
            >
              Récupération Automatique de l'Attestation
            </h1>
            <h2
              style={{
                fontSize: "1.4rem",
                color: "#667eea",
                marginBottom: "10px",
                fontWeight: "600",
              }}
            >
              Formation Doctorales en Intelligence Artificielle
            </h2>
            <p
              style={{
                color: "#888",
                fontSize: "1rem",
                fontStyle: "italic",
              }}
            >
              Pr. A. Aaroud
            </p>
          </div>

          {/* Logout Button - Properly positioned */}
          <button
            onClick={handleLogout}
            className="btn btn-danger"
            style={{
              position: "absolute",
              top: "30px",
              right: "30px",
              fontSize: "14px",
              padding: "8px 16px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(244, 67, 54, 0.2)",
              zIndex: 10,
            }}
          >
            Déconnexion
          </button>
        </header>

        <div className="grid grid-2">
          <StudentInfo userData={userData} />

          <div className="card p-30">
            <h2
              style={{
                fontSize: "1.8rem",
                marginBottom: "20px",
                color: "#333",
              }}
            >
              Sessions de Formation
            </h2>

            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "rgba(102, 126, 234, 0.1)",
                borderRadius: "10px",
              }}
            >
              <p
                style={{
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Total des heures: 15h (5h par session)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-2 mt-20">
          <div className="card p-30 text-center">
            <h2
              style={{
                fontSize: "1.8rem",
                marginBottom: "20px",
                color: "#333",
              }}
            >
              Note d'Examen
            </h2>

            <div className="grade-display">{userData.note || 0}/20</div>

            <div
              style={{
                padding: "15px",
                background: userData.note >= 10 ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                borderRadius: "10px",
                marginTop: "20px",
              }}
            >
              <p
                style={{
                  fontWeight: "600",
                  color: userData.note >= 10 ? "#2e7d32" : "#d32f2f",
                }}
              >
                {userData.note >= 10 ? "Réussi" : "Échec"}
              </p>
            </div>
          </div>

          <CertificateSection userData={userData} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
