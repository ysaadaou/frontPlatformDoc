"use client"
//
//import { useState } from "react"
//import axios from "axios"
//
//// For development, use proxy. For production, use environment variable
//const API_BASE_URL =
//  process.env.NODE_ENV === "production"
//    ? process.env.REACT_APP_API_URL || "https://back-platform-doc-gd5d.vercel.app"
//    : "" // Empty string uses the proxy in development
//
//// Configure axios with base URL
//const api = axios.create({
//  baseURL: API_BASE_URL,
//  timeout: 10000,
//})
//
//const CertificateSection = ({ userData }) => {
//  const [downloading, setDownloading] = useState(false)
//  const [downloadMessage, setDownloadMessage] = useState("")
//
//  // Check eligibility conditions
//  const sessionsAttended = [userData.sessions?.s1, userData.sessions?.s2, userData.sessions?.s3].filter(
//    (session) => session === "P",
//  ).length
//
//  const hasMinimumGrade = userData.note >= 10
//  const hasAttendedAllSessions = sessionsAttended === 3
//  const isEligible = userData.eligible && hasMinimumGrade && hasAttendedAllSessions
//
//  const handleDownload = async () => {
//    if (!isEligible) return
//
//    setDownloading(true)
//    setDownloadMessage("")
//
//    try {
//      const token = localStorage.getItem("token")
//
//      // If Google Drive link exists, open it directly
//      if (userData.lienCertificat) {
//        window.open(userData.lienCertificat, "_blank")
//        setDownloadMessage("Certificat ouvert dans un nouvel onglet!")
//
//        // Mark as downloaded
//        await api.post(
//          "/api/certificate/mark-downloaded",
//          { studentId: userData._id },
//          {
//            headers: { Authorization: `Bearer ${token}` },
//          },
//        )
//      } else {
//        // Fallback to PDF generation
//        const response = await api.post(
//          "/api/certificate/download",
//          { studentId: userData._id },
//          {
//            headers: { Authorization: `Bearer ${token}` },
//            responseType: "blob",
//          },
//        )
//
//        // Create download link
//        //const url = window.URL.createObjectURL(new Blob([response.data]))
//        //const link = document.createElement("a")
//        //link.href = url
//        //link.setAttribute("download", `certificat_${userData.cin}.pdf`)
//        //document.body.appendChild(link)
//        //link.click()
//        //link.remove()
//        //window.URL.revokeObjectURL(url)
//        //
//        setDownloadMessage("Certificat téléchargé avec succès!")
//      }
//    } catch (error) {
//      setDownloadMessage("Erreur lors de l'accès au certificat.")
//    } finally {
//      setDownloading(false)
//    }
//  }
//
//  return (
//    <div className="card p-30 text-center">
//      <h2
//        style={{
//          fontSize: "1.8rem",
//          marginBottom: "20px",
//          color: "#333",
//        }}
//      >
//        Certificat de Formation
//      </h2>
//
//      <div
//        style={{
//          padding: "20px",
//          background: isEligible ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
//          borderRadius: "15px",
//          marginBottom: "20px",
//        }}
//      >
//        <h3
//          style={{
//            fontSize: "1.3rem",
//            marginBottom: "15px",
//            color: isEligible ? "#2e7d32" : "#d32f2f",
//          }}
//        >
//          {isEligible ? "Éligible au Certificat" : "Non Éligible"}
//        </h3>
//
//        <div style={{ textAlign: "left" }}>
//          <div
//            style={{
//              display: "flex",
//              alignItems: "center",
//              marginBottom: "10px",
//              gap: "10px",
//            }}
//          >
//            <span
//              style={{
//                color: hasMinimumGrade ? "#2e7d32" : "#d32f2f",
//                fontSize: "1.2rem",
//              }}
//            >
//              {hasMinimumGrade ? "✓" : "✗"}
//            </span>
//            <span>Note minimale (10/20): {userData.note}/20</span>
//          </div>
//
//          <div
//            style={{
//              display: "flex",
//              alignItems: "center",
//              marginBottom: "10px",
//              gap: "10px",
//            }}
//          >
//            <span
//              style={{
//                color: hasAttendedAllSessions ? "#2e7d32" : "#d32f2f",
//                fontSize: "1.2rem",
//              }}
//            >
//              {hasAttendedAllSessions ? "✓" : "✗"}
//            </span>
//            <span>Présence aux 3 sessions: {sessionsAttended}/3</span>
//          </div>
//
//          <div
//            style={{
//              display: "flex",
//              alignItems: "center",
//              gap: "10px",
//            }}
//          >
//            <span
//              style={{
//                color: userData.eligible ? "#2e7d32" : "#d32f2f",
//                fontSize: "1.2rem",
//              }}
//            >
//              {userData.eligible ? "✓" : "✗"}
//            </span>
//            <span>Validation administrative</span>
//          </div>
//        </div>
//      </div>
//
//      {downloadMessage && (
//        <div
//          className={`alert ${downloadMessage.includes("succès") || downloadMessage.includes("ouvert") ? "alert-success" : "alert-error"}`}
//        >
//          {downloadMessage}
//        </div>
//      )}
//
//      <button
//        onClick={handleDownload}
//        disabled={!isEligible || downloading}
//        className={`btn ${isEligible ? "btn-success" : "btn-danger"}`}
//        style={{
//          width: "100%",
//          opacity: !isEligible ? 0.6 : 1,
//          cursor: !isEligible ? "not-allowed" : "pointer",
//        }}
//      >
//        {downloading ? "Accès en cours..." : isEligible ? "Accéder au Certificat" : "Certificat Non Disponible"}
//      </button>
//
//      {userData.certificatTelecharge && (
//        <p
//          style={{
//            marginTop: "15px",
//            color: "#2e7d32",
//            fontWeight: "600",
//          }}
//        >
//          Certificat déjà consulté
//        </p>
//      )}
//    </div>
//  )
//}
//
//export default CertificateSection
//
//



import { useState, useEffect } from "react"
import api from "../utils/api"

const CertificateSection = ({ userData }) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [certificateStatus, setCertificateStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(true)

  // Check eligibility conditions
  const sessionsAttended = [userData.sessions?.s1, userData.sessions?.s2, userData.sessions?.s3].filter(
    (session) => session === "P",
  ).length

  const hasMinimumGrade = userData.note >= 10
  const hasAttendedAllSessions = sessionsAttended === 3
  const isEligible = userData.eligible && hasMinimumGrade && hasAttendedAllSessions

  // Check certificate availability on component mount
  useEffect(() => {
    const checkCertificateStatus = async () => {
      try {
        setStatusLoading(true)
        const response = await api.get("/certificate/check")

        if (response.data.success) {
          setCertificateStatus(response.data.data)
          console.log("Certificate status:", response.data.data)
        }
      } catch (error) {
        console.error("Error checking certificate status:", error)
        setMessage("Erreur lors de la vérification du certificat")
      } finally {
        setStatusLoading(false)
      }
    }

    if (isEligible) {
      checkCertificateStatus()
    } else {
      setStatusLoading(false)
    }
  }, [isEligible])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleAccessCertificate = async () => {
    if (!isEligible) {
      setMessage("Vous n'êtes pas éligible à l'accès au certificat")
      return
    }

    if (!certificateStatus?.hasGoogleDriveLink) {
      setMessage("Aucun lien Google Drive disponible pour votre certificat")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      console.log("Requesting certificate Google Drive link...")

      const response = await api.post("/certificate/get-link")

      if (response.data.success) {
        const { googleDriveLink, directDownloadLink } = response.data.data

        // Update certificate status
        setCertificateStatus((prev) => ({
          ...prev,
          downloaded: true,
        }))

        // Open Google Drive link in new tab
        window.open(googleDriveLink, "_blank", "noopener,noreferrer")

        setMessage("Redirection vers Google Drive réussie!")

        // Optional: Also provide direct download link
        if (directDownloadLink && directDownloadLink !== googleDriveLink) {
          setTimeout(() => {
            const downloadConfirm = window.confirm(
              "Voulez-vous également essayer le téléchargement direct du fichier PDF?",
            )
            if (downloadConfirm) {
              window.open(directDownloadLink, "_blank", "noopener,noreferrer")
            }
          }, 2000)
        }
      }
    } catch (error) {
      console.error("Certificate access error:", error)

      let errorMessage = "Erreur lors de l'accès au certificat"

      if (error.response?.status === 404) {
        errorMessage = "Certificat non trouvé"
      } else if (error.response?.status === 403) {
        errorMessage = "Accès non autorisé au certificat"
      } else if (error.response?.status === 401) {
        errorMessage = "Session expirée. Veuillez vous reconnecter."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (statusLoading) {
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
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    )
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
              marginBottom: "10px",
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

          {isEligible && certificateStatus && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  color: certificateStatus.hasGoogleDriveLink ? "#2e7d32" : "#d32f2f",
                  fontSize: "1.2rem",
                }}
              >
                {certificateStatus.hasGoogleDriveLink ? "✓" : "✗"}
              </span>
              <span>Certificat disponible sur Google Drive</span>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes("réussie") ? "alert-success" : "alert-error"}`}>{message}</div>
      )}

      {/* Google Drive Info */}
      {isEligible && certificateStatus?.hasGoogleDriveLink && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            background: "rgba(66, 133, 244, 0.1)",
            borderRadius: "10px",
            border: "1px solid rgba(66, 133, 244, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#4285f4">
              <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
            </svg>
            <span style={{ fontWeight: "600", color: "#4285f4" }}>Certificat hébergé sur Google Drive</span>
          </div>
          <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>
            Cliquez sur le bouton ci-dessous pour accéder à votre certificat sur Google Drive où vous pourrez le
            visualiser et le télécharger.
          </p>
        </div>
      )}

      <button
        onClick={handleAccessCertificate}
        disabled={!isEligible || !certificateStatus?.hasGoogleDriveLink || loading}
        className={`btn ${isEligible && certificateStatus?.hasGoogleDriveLink ? "btn-success" : "btn-danger"}`}
        style={{
          width: "100%",
          opacity: !isEligible || !certificateStatus?.hasGoogleDriveLink ? 0.6 : 1,
          cursor: !isEligible || !certificateStatus?.hasGoogleDriveLink ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {loading ? (
          <>
            <div className="spinner" style={{ width: "16px", height: "16px" }}></div>
            Redirection...
          </>
        ) : isEligible && certificateStatus?.hasGoogleDriveLink ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
            </svg>
            Accéder au Certificat (Google Drive)
          </>
        ) : (
          "Certificat Non Disponible"
        )}
      </button>

      {certificateStatus?.downloaded && (
        <p
          style={{
            marginTop: "15px",
            color: "#2e7d32",
            fontWeight: "600",
          }}
        >
          ✓ Certificat déjà consulté
        </p>
      )}

      {userData.qrCodeLink && (
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
              fontSize: "0.9rem",
              color: "#666",
              marginBottom: "10px",
            }}
          >
            Lien de vérification QR Code:
          </p>
          <a
            href={userData.qrCodeLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#667eea",
              textDecoration: "none",
              fontSize: "0.9rem",
              wordBreak: "break-all",
            }}
          >
            {userData.qrCodeLink}
          </a>
        </div>
      )}
    </div>
  )
}

export default CertificateSection
