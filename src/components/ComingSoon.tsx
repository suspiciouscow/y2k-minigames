import { useParams, Link, Navigate } from 'react-router-dom'
import { useState } from 'react'

const ComingSoon = () => {
  const { id } = useParams<{ id: string }>()
  
  // Check if the game ID is 'snake', then redirect to the Snake game
  if (id === 'snake') {
    return <Navigate to="/game/snake" />
  }
  
  // For other games (that aren't implemented yet)
  const [windowPosition, setWindowPosition] = useState({ top: '50px', left: '150px' })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  // Game titles mapping
  const gameTitles = {
    'painter': 'Pixel Painter',
    'quiz': 'Y2K Quiz',
    'sound': 'Sound Board',
    'soon': 'Mystery Game'
  } as const
  
  // Game icons mapping
  const gameIcons = {
    'painter': '🎨',
    'quiz': '💿',
    'sound': '🔊',
    'soon': '✨'
  } as const
  
  // Get game title or default
  const gameTitle = id ? gameTitles[id as keyof typeof gameTitles] || 'This Game' : 'This Game'
  const gameIcon = id ? gameIcons[id as keyof typeof gameIcons] || '🎮' : '🎮'
  
  // Window dragging functions
  const startDrag = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - parseInt(windowPosition.left),
      y: e.clientY - parseInt(windowPosition.top)
    })
    
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDrag)
  }
  
  const handleDrag = (e: MouseEvent) => {
    if (isDragging) {
      setWindowPosition({
        top: `${e.clientY - dragOffset.y}px`,
        left: `${e.clientX - dragOffset.x}px`
      })
    }
  }
  
  const stopDrag = () => {
    setIsDragging(false)
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
  }
  
  return (
    <div 
      style={{
        position: 'absolute',
        top: windowPosition.top,
        left: windowPosition.left,
        backgroundColor: '#d4d0c8',
        border: '2px outset #ffffff',
        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)',
        fontFamily: '"MS Sans Serif", Arial, sans-serif',
        width: '400px',
        zIndex: 100
      }}
    >
      {/* Window title bar */}
      <div 
        style={{
          backgroundColor: '#000084',
          color: 'white',
          padding: '3px 5px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'move',
          userSelect: 'none'
        }}
        onMouseDown={startDrag}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={`/icons/${id}.png`} 
            alt="" 
            style={{ 
              width: '16px', 
              height: '16px',
              marginRight: '5px'
            }} 
          />
          <span>BubbleNet 2000 - {gameTitle}</span>
        </div>
        <div style={{ display: 'flex' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div 
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#d4d0c8',
                border: '1px outset #ffffff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: '2px',
                fontSize: '9px',
                cursor: 'pointer'
              }}
            >
              ×
            </div>
          </Link>
        </div>
      </div>
      
      {/* Content */}
      <div style={{ padding: '15px' }}>
        {/* Simple coming soon message */}
        <div 
          style={{
            border: '2px inset #ffffff',
            backgroundColor: 'white',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div 
            style={{
              fontSize: '36px', 
              margin: '10px 0',
              animation: 'blink 1s infinite'
            }}
          >
            {gameIcon}
          </div>
          
          <h2 
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#000000',
              textAlign: 'center',
              margin: '10px 0'
            }}
          >
            {gameTitle} Coming Soon!
          </h2>
          
          <div style={{ fontSize: '12px', marginBottom: '15px', textAlign: 'center' }}>
            This game is still under development.<br/>
            Please try Y2K Snake while you wait!
          </div>
          
          <Link to="/game/snake/play" style={{ textDecoration: 'none' }}>
            <button 
              style={{
                backgroundColor: '#d4d0c8',
                border: '2px outset #ffffff',
                padding: '4px 20px',
                cursor: 'pointer',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '12px',
                margin: '10px 0'
              }}
            >
              Play Snake Game Instead
            </button>
          </Link>
        </div>
        
        {/* Buttons */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '15px'
          }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button 
              style={{
                backgroundColor: '#d4d0c8',
                border: '2px outset #ffffff',
                padding: '4px 20px',
                cursor: 'pointer',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '12px'
              }}
            >
              Back to Games
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon