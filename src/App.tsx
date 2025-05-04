import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './components/HomePage'
import MemoryGame from './components/games/MemoryGame'
import ComingSoon from './components/ComingSoon'
import CursorTrail from './components/CursorTrail'
import MP3Player from './components/MP3Player'

const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Simulate asset loading with progress
    const totalAssets = 10
    let loadedAssets = 0
    
    const loadingInterval = setInterval(() => {
      loadedAssets++
      setLoadingProgress(Math.floor((loadedAssets / totalAssets) * 100))
      
      if (loadedAssets >= totalAssets) {
        clearInterval(loadingInterval)
        setIsLoading(false)
        
        // Auto-hide splash after 5 seconds
        setTimeout(() => {
          setShowSplash(false)
        }, 5000)
      }
    }, 300)

    return () => clearInterval(loadingInterval)
  }, [])
  
  // Handle enter site button click
  const handleEnterSite = () => {
    setShowSplash(false)
  }

  // Loading screen
  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #ff99cc, #9933ff)',
        color: 'white',
        fontFamily: '"Comic Sans MS", cursive',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{
          fontSize: '30px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textShadow: '2px 2px 0 #6600cc',
          animation: 'blink 1s infinite'
        }}>
          Loading BubbleNet 2000...
        </div>
        
        <div style={{
          width: '80%',
          maxWidth: '400px',
          padding: '5px',
          border: '3px solid white',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '5px',
          position: 'relative',
          marginBottom: '20px',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
        }}>
          <div style={{
            width: `${loadingProgress}%`,
            height: '20px',
            background: 'linear-gradient(to right, #33ccff, #ff33cc)',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '1px 1px 0 #000'
          }}>
            {loadingProgress}%
          </div>
        </div>
        
        <div style={{
          fontSize: '12px',
          margin: '10px 0',
          fontStyle: 'italic'
        }}>
          Initializing cyber connections...
        </div>
        
        <div style={{
          fontSize: '10px',
          marginTop: '20px',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          Best viewed in Internet Explorer 5.0 or Netscape Navigator 4.7
        </div>
      </div>
    )
  }
  
  // Splash screen
  if (showSplash) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'url(data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="%23cc33ff" /><rect x="10" y="10" width="10" height="10" fill="%23cc33ff" /><rect x="10" y="0" width="10" height="10" fill="%23ff33cc" /><rect x="0" y="10" width="10" height="10" fill="%23ff33cc" /></svg>)',
        color: 'white',
        fontFamily: '"Comic Sans MS", cursive',
        textAlign: 'center',
        padding: '20px',
        overflow: 'hidden'
      }}>
        <h1 style={{
          fontSize: '5rem',
          fontWeight: 'bold',
          margin: '0 0 20px',
          color: '#ff33cc',
          textShadow: '3px 3px 0 #33ccff, -1px -1px 0 #ffffff, 5px 5px 10px rgba(255, 51, 204, 0.7)',
          animation: 'blink 2s infinite',
          letterSpacing: '2px'
        }}>
          BubbleNet 2000
        </h1>
        
        <h2 style={{
          fontSize: '2rem',
          color: '#33ccff',
          margin: '0 0 40px',
          textShadow: '2px 2px 0 #9933ff',
          fontWeight: 'bold'
        }}>
          Your Y2K Gaming Paradise!
        </h2>
        
        <div style={{
          animation: 'blink 1s infinite',
          fontSize: '1.5rem',
          margin: '0 0 40px',
          color: 'yellow',
          textShadow: '1px 1px 0 #ff33cc'
        }}>
          Loading Complete!
        </div>
        
        <button 
          onClick={handleEnterSite}
          style={{
            background: 'linear-gradient(to bottom, #ff33cc, #cc00aa)',
            color: 'white',
            border: '3px solid white',
            borderRadius: '50px',
            padding: '15px 40px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(255, 51, 204, 0.8), 5px 5px 0 rgba(0, 0, 0, 0.2)',
            fontFamily: '"Comic Sans MS", cursive',
            animation: 'pulse 2s infinite',
            textShadow: '2px 2px 0 #9900cc',
            marginBottom: '40px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = 'scale(1.05) rotate(-2deg)'
          }}
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0)'
          }}
        >
          Enter Site Now!
        </button>
        
        <div style={{
          fontSize: '12px',
          marginTop: '30px',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          © 2025 BubbleNet 2000 • All Rights Reserved
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '10px',
          color: 'white'
        }}>
          <div style={{
            padding: '5px 10px',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '5px',
            marginBottom: '5px'
          }}>
            Best viewed in 800x600
          </div>
          <div style={{
            display: 'flex',
            gap: '5px'
          }}>
            <img src="/badges/netscape.gif" alt="Netscape" width="88" height="31" style={{ border: '0' }} />
            <img src="/badges/ie.gif" alt="Internet Explorer" width="88" height="31" style={{ border: '0' }} />
            <img src="/badges/midi.gif" alt="MIDI Enabled" width="88" height="31" style={{ border: '0' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <CursorTrail />
      <MP3Player />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/memory" element={<MemoryGame />} />
        <Route path="/game/:id" element={<ComingSoon />} />
      </Routes>
    </Router>
  )
}

export default App