
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
