"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Login = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cin: "",
    motDePasse: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  // Enhanced error display with longer timeout
  useEffect(() => {
    if (error) {
      setShowError(true)
      const timer = setTimeout(() => {
        setShowError(false)
        setTimeout(() => setError(""), 500) // Longer fade out time
      }, 8000) // Show error for 8 seconds instead of 5

      return () => clearTimeout(timer)
    }
  }, [error])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Don't clear error immediately when typing
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setShowError(false)

    // Basic validation
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.cin.trim() || !formData.motDePasse) {
      setError("Tous les champs sont obligatoires")
      setLoading(false)
      return
    }

    // Add delay to prevent immediate error flash
    await new Promise((resolve) => setTimeout(resolve, 500))

    const result = await login(formData)

    if (!result.success) {
      setError(result.message)
      // Don't set loading to false immediately to prevent page refresh feeling
      setTimeout(() => {
        setLoading(false)
      }, 300)
    } else {
      setLoading(false)
    }
  }

  const handleCloseError = () => {
    setShowError(false)
    setTimeout(() => setError(""), 500)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div
      className="container fade-in"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "40px",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
            padding: "30px 20px",
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)",
            borderRadius: "15px",
            border: "1px solid rgba(102, 126, 234, 0.1)",
          }}
        >
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "15px",
              lineHeight: "1.2",
            }}
          >
            Récupération Automatique
          </h1>
          <h2
            style={{
              fontSize: "1.4rem",
              color: "#667eea",
              marginBottom: "10px",
              fontWeight: "600",
            }}
          >
            Attestation Formation Doctorales
          </h2>
          <p
            style={{
              color: "#666",
              fontSize: "1.1rem",
              marginBottom: "8px",
            }}
          >
            Intelligence Artificielle
          </p>
          <p
            style={{
              color: "#888",
              fontSize: "0.95rem",
              fontStyle: "italic",
            }}
          >
            Pr. A. Aaroud
          </p>
        </div>

        {/* Enhanced Error Display with Better Visibility */}
        {error && (
          <div
            className={`alert alert-error ${showError ? "error-show" : "error-hide"}`}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.5s ease",
              opacity: showError ? 1 : 0,
              transform: showError ? "translateY(0)" : "translateY(-10px)",
              marginBottom: showError ? "25px" : "0px",
              padding: "15px 20px",
              fontSize: "15px",
              fontWeight: "500",
              boxShadow: showError ? "0 4px 12px rgba(244, 67, 54, 0.2)" : "none",
            }}
          >
            <span style={{ flex: 1, lineHeight: "1.4" }}>{error}</span>
            <button
              onClick={handleCloseError}
              style={{
                background: "none",
                border: "none",
                color: "#d32f2f",
                cursor: "pointer",
                fontSize: "20px",
                padding: "0 8px",
                marginLeft: "15px",
                fontWeight: "bold",
              }}
              title="Fermer"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="nom">Nom de famille</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              placeholder="Entrez votre nom de famille"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="prenom">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              placeholder="Entrez votre prénom"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="cin">Numéro CIN</label>
            <input
              type="text"
              id="cin"
              name="cin"
              value={formData.cin}
              onChange={handleChange}
              required
              placeholder="Entrez votre numéro CIN"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="motDePasse">Code d'accès</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="motDePasse"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                required
                placeholder="Entrez votre code d'accès"
                disabled={loading}
                style={{
                  paddingRight: "50px",
                }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-btn"
                disabled={loading}
                title={showPassword ? "Masquer le code" : "Afficher le code"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <div className="spinner" style={{ width: "20px", height: "20px" }}></div>
                Vérification en cours...
              </span>
            ) : (
              "Accéder à mon espace"
            )}
          </button>
        </form>

        <div className="text-center mt-20">
          <p
            style={{
              fontSize: "0.9rem",
              color: "#666",
              lineHeight: "1.4",
            }}
          >
            Plateforme sécurisée pour la récupération des attestations
            <br />
            Formation Doctorale - Intelligence Artificielle
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
