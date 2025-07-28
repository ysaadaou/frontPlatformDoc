import { useState, useEffect } from 'react'

const Timer = ({ onTimeout, duration = 600 }) => { // 600 seconds = 10 minutes
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          onTimeout()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeout])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (timeLeft <= 60) return '#f44336' // Red for last minute
    if (timeLeft <= 180) return '#ff9800' // Orange for last 3 minutes
    return '#f44336' // Default red
  }

  return (
    <div
      className="timer-display"
      style={{
        backgroundColor: getTimerColor(),
        animation: timeLeft <= 60 ? 'pulse 1s infinite' : 'none'
      }}
    >
      ⏰ Déconnexion: {formatTime(timeLeft)}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default Timer
