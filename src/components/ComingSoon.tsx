import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const ComingSoon = () => {
  const { id } = useParams()
  const [countdown, setCountdown] = useState(3)
  
  // Game titles mapping
  const gameTitles = {
    'snake': 'Y2K Snake',
    'painter': 'Pixel Painter',
    'quiz': 'Y2K Quiz',
    'sound': 'Sound Board',
    'soon': 'Mystery Game'
  }
  
  // Get game title or default
  const gameTitle = gameTitles[id as keyof typeof gameTitles] || 'This Game'
  
  useEffect(() => {
    // Auto countdown
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [countdown])
  
  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <div className="card" style={{ marginTop: '50px', padding: '40px' }}>
        <div className="under-construction" style={{ 
          transform: 'rotate(-2deg)', 
          margin: '0 auto 30px auto',
          padding: '10px 20px',
          display: 'inline-block',
          fontSize: '1.2rem'
        }}>
          🚧 UNDER CONSTRUCTION 🚧
        </div>
        
        <h1 className="y2k-header" style={{ marginBottom: '30px' }}>
          {gameTitle}
        </h1>
        
        <div className="floating" style={{ 
          fontSize: '5rem', 
          marginBottom: '30px',
          animation: 'float 3s ease-in-out infinite'
        }}>
          💾
        </div>
        
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '20px',
          color: 'var(--text-dark)'
        }}>
          We're still coding this awesome game! <br />
          Check back soon for more Y2K goodness.
        </p>
        
        <div className="pulsing" style={{ 
          margin: '30px auto',
          padding: '15px',
          backgroundColor: 'rgba(255, 102, 204, 0.1)',
          borderRadius: '10px',
          maxWidth: '400px'
        }}>
          <p className="rainbow-text" style={{ fontWeight: 'bold' }}>
            Development progress: 42%
          </p>
          
          <div style={{ 
            height: '20px',
            background: '#f0f0f0',
            borderRadius: '10px',
            margin: '15px auto',
            border: '2px solid var(--primary)',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: '42%',
              height: '100%',
              background: 'linear-gradient(to right, var(--primary), var(--secondary))'
            }}></div>
          </div>
        </div>
        
        <p style={{ marginBottom: '30px', fontSize: '0.9rem', color: '#666' }}>
          {countdown > 0 
            ? `Returning to home page in ${countdown}...` 
            : "Time's up!"
          }
        </p>
        
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button className="btn" style={{ 
            padding: '12px 30px',
            fontSize: '1.1rem'
          }}>
            Back to Games
          </button>
        </Link>
      </div>
    </div>
  )
}

export default ComingSoon