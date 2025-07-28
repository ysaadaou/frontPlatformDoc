"use client"

import { useState } from "react"
import axios from "axios"

// For development, use proxy. For production, use environment variable
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL || "https://back-platform-doc-gd5d.vercel.app"
    : "" // Empty string uses the proxy in development

// Configure axios with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

const CertificateSection = ({ userData }) => {
  const [downloading, setDownloading] = useState(false)
  const [downloadMessage, setDownloadMessage] = useState("")

  // Check eligibility conditions
  const sessionsAttended = [userData.sessions?.s1, userData.sessions?.s2, userData.sessions?.s3].filter(
    (session) => session === "P",
  ).length

  const hasMinimumGrade = userData.note >= 10
  const hasAttendedAllSessions = sessionsAttended === 3
  const isEligible = userData.eligible && hasMinimumGrade && hasAttendedAllSessions

  const handleDownload = async () => {
    if (!isEligible) return

    setDownloading(true)
    setDownloadMessage("")

    try {
      const token = localStorage.getItem("token")

      // If Google Drive link exists, open it directly
      if (userData.lienCertificat) {
        window.open(userData.lienCertificat, "_blank")
        setDownloadMessage("Certificat ouvert dans un nouvel onglet!")

        // Mark as downloaded
        await api.post(
          "/api/certificate/mark-downloaded",
          { studentId: userData._id },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
      } else {
        // Fallback to PDF generation
        const response = await api.post(
          "/api/certificate/download",
          { studentId: userData._id },
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          },
        )

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `certificat_${userData.cin}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        setDownloadMessage("Certificat téléchargé avec succès!")
      }
    } catch (error) {
      setDownloadMessage("Erreur lors de l'accès au certificat.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="card p-30 text-center">
      <h2
        style={{
          fontSize: "1.8rem",
          marginBottom: "20px",
          color: "#333",
        }}
      >
        Certificat de Formation
      </h2>

      <div
        style={{
          padding: "20px",
          background: isEligible ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
          borderRadius: "15px",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "1.3rem",
            marginBottom: "15px",
            color: isEligible ? "#2e7d32" : "#d32f2f",
          }}
        >
          {isEligible ? "Éligible au Certificat" : "Non Éligible"}
        </h3>

        <div style={{ textAlign: "left" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              gap: "10px",
            }}
          >
            <span
              style={{
                color: hasMinimumGrade ? "#2e7d32" : "#d32f2f",
                fontSize: "1.2rem",
              }}
            >
              {hasMinimumGrade ? "✓" : "✗"}
            </span>
            <span>Note minimale (10/20): {userData.note}/20</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              gap: "10px",
            }}
          >
            <span
              style={{
                color: hasAttendedAllSessions ? "#2e7d32" : "#d32f2f",
                fontSize: "1.2rem",
              }}
            >
              {hasAttendedAllSessions ? "✓" : "✗"}
            </span>
            <span>Présence aux 3 sessions: {sessionsAttended}/3</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                color: userData.eligible ? "#2e7d32" : "#d32f2f",
                fontSize: "1.2rem",
              }}
            >
              {userData.eligible ? "✓" : "✗"}
            </span>
            <span>Validation administrative</span>
          </div>
        </div>
      </div>

      {downloadMessage && (
        <div
          className={`alert ${downloadMessage.includes("succès") || downloadMessage.includes("ouvert") ? "alert-success" : "alert-error"}`}
        >
          {downloadMessage}
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={!isEligible || downloading}
        className={`btn ${isEligible ? "btn-success" : "btn-danger"}`}
        style={{
          width: "100%",
          opacity: !isEligible ? 0.6 : 1,
          cursor: !isEligible ? "not-allowed" : "pointer",
        }}
      >
        {downloading ? "Accès en cours..." : isEligible ? "Accéder au Certificat" : "Certificat Non Disponible"}
      </button>

      {userData.certificatTelecharge && (
        <p
          style={{
            marginTop: "15px",
            color: "#2e7d32",
            fontWeight: "600",
          }}
        >
          Certificat déjà consulté
        </p>
      )}
    </div>
  )
}

export default CertificateSection
