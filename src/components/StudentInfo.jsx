const StudentInfo = ({ userData }) => {
  const infoItems = [
    {
      label: 'Nom complet',
      value: `${userData.prenom} ${userData.nom}`,
      icon: '👤'
    },
    {
      label: 'Email',
      value: userData.email,
      icon: '📧'
    },
    {
      label: 'CIN',
      value: userData.cin,
      icon: '🆔'
    },
    {
      label: 'Téléphone',
      value: userData.telephone,
      icon: '📱'
    },
    {
      label: 'Faculté',
      value: userData.faculte,
      icon: '🏛️'
    }
  ]

  return (
    <div className="card p-30">
      <h2
        style={{
          fontSize: '1.8rem',
          marginBottom: '20px',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        👤 Informations Personnelles
      </h2>

      <div className="grid" style={{ gap: '15px' }}>
        {infoItems.map((item, index) => (
          <div
            key={index}
            style={{
              padding: '15px',
              background: 'rgba(102, 126, 234, 0.05)',
              borderRadius: '10px',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              transition: 'all 0.3s ease'
            }}
            className="info-item"
          >
            <label
              style={{
                fontWeight: '600',
                color: '#555',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '5px',
                fontSize: '0.9rem'
              }}
            >
              <span>{item.icon}</span>
              {item.label}:
            </label>
            <p
              style={{
                fontSize: '1.1rem',
                color: '#333',
                wordBreak: 'break-word',
                marginLeft: '24px'
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .info-item:hover {
          background: rgba(102, 126, 234, 0.08) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  )
}

export default StudentInfo
