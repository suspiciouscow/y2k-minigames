import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

type WindowName = 'main' | 'games' | 'guestbook'

interface WindowPosition {
  top: string;
  left: string;
  width: string;
  height: string;
  zIndex: number;
}

interface WindowPositions {
  main: WindowPosition;
  games: WindowPosition;
  guestbook: WindowPosition;
}

const HomePage = () => {
  const [time, setTime] = useState(new Date())
  const [activeWindow, setActiveWindow] = useState<WindowName>('main')
  const [windowPositions, setWindowPositions] = useState<WindowPositions>({
    main: { top: '50px', left: '150px', width: '600px', height: '400px', zIndex: 100 },
    games: { top: '80px', left: '200px', width: '500px', height: '350px', zIndex: 10 },
    guestbook: { top: '100px', left: '250px', width: '400px', height: '300px', zIndex: 10 }
  })
  const [visitorCount, setVisitorCount] = useState(0)
  const [showGlitter, setShowGlitter] = useState<{ id: number; x: number; y: number }[]>([])
  const [dragInfo, setDragInfo] = useState<{ dragging: boolean; window: WindowName | null; offsetX: number; offsetY: number }>({ dragging: false, window: null, offsetX: 0, offsetY: 0 })
  const [dogPosition, setDogPosition] = useState({ x: 200, y: 200 })
  const [dogDragging, setDogDragging] = useState(false)
  const [dogDragOffset, setDogDragOffset] = useState({ x: 0, y: 0 })
  const [showWoof, setShowWoof] = useState(false)
  const dogWidth = 64
  
  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  // Set random visitor count
  useEffect(() => {
    setVisitorCount(Math.floor(Math.random() * 10000) + 1000)
  }, [])
  
  // Set initial dog position to right side on mount
  useEffect(() => {
    setDogPosition({
      x: window.innerWidth - 100,
      y: 200
    })
  }, [])
  
  // Animate dog walking when not dragging
  useEffect(() => {
    if (!dogDragging) {
      const interval = setInterval(() => {
        setDogPosition(pos => {
          let nextX = pos.x - 1
          if (nextX < -dogWidth) {
            nextX = window.innerWidth
          }
          return { ...pos, x: nextX }
        })
      }, 20)
      return () => clearInterval(interval)
    }
  }, [dogDragging])
  
  // Add glitter effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (Math.random() > 0.97) {
      const newGlitter = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      }
      
      setShowGlitter(prev => [...prev, newGlitter])
      
      setTimeout(() => {
        setShowGlitter(prev => prev.filter(glitter => glitter.id !== newGlitter.id))
      }, 1000)
    }
    
    // Handle window dragging
    if (dragInfo.dragging && dragInfo.window) {
      const newLeft = e.clientX - dragInfo.offsetX
      const newTop = e.clientY - dragInfo.offsetY
      
      setWindowPositions(prev => ({
        ...prev,
        [dragInfo.window!]: {
          ...prev[dragInfo.window!],
          top: `${newTop}px`,
          left: `${newLeft}px`
        }
      }))
    }
  }
  
  // Start dragging a window
  const startDrag = (e: React.MouseEvent<HTMLDivElement>, windowName: WindowName) => {
    // Make this window active
    setActiveWindow(windowName)
    
    // Get window element
    const windowElement = e.currentTarget.parentElement
    if (!windowElement) return
    
    // Get position of mouse relative to window
    const rect = windowElement.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    
    // Set dragging state
    setDragInfo({
      dragging: true,
      window: windowName,
      offsetX,
      offsetY
    })
    
    // Update all window z-indexes
    setWindowPositions(prev => {
      const highestZ = Math.max(...Object.values(prev).map(w => w.zIndex))
      
      // Create new state with updated z-indexes
      const newState = { ...prev }
      newState[windowName].zIndex = highestZ + 1
      
      return newState
    })
    
    // Add event listeners
    document.addEventListener('mouseup', stopDrag)
  }
  
  // Stop dragging
  const stopDrag = () => {
    setDragInfo({ dragging: false, window: null, offsetX: 0, offsetY: 0 })
    document.removeEventListener('mouseup', stopDrag)
  }
  
  // Close a window
  const closeWindow = (windowName: WindowName) => {
    setWindowPositions(prev => {
      const newPositions = { ...prev }
      
      if (windowName === 'main') {
        // Can't close main window, just minimize
        newPositions[windowName].top = '-100px'
      } else {
        // Set position off-screen
        newPositions[windowName].top = '-1000px'
      }
      
      return newPositions
    })
  }
  
  // Open a window
  const openWindow = (windowName: WindowName) => {
    setActiveWindow(windowName)
    
    setWindowPositions(prev => {
      const highestZ = Math.max(...Object.values(prev).map(w => w.zIndex))
      const newPositions = { ...prev }
      
      if (windowName === 'main') {
        newPositions[windowName].top = '50px'
      } else if (windowName === 'games') {
        newPositions[windowName].top = '80px'
      } else if (windowName === 'guestbook') {
        newPositions[windowName].top = '100px'
      }
      
      newPositions[windowName].zIndex = highestZ + 1
      
      return newPositions
    })
  }
  
  // Games data
  const games = [
    { id: 'memory', title: 'Memory Match', description: 'Test your memory skills with Y2K icons!' },
    { id: 'snake', title: 'Y2K Snake', description: 'Guide the snake to collect pixels!' },
    { id: 'painter', title: 'Pixel Painter', description: 'Create your own pixel art masterpieces!' },
    { id: 'quiz', title: 'Y2K Quiz', description: 'How much do you remember about the 2000s?' },
    { id: 'sound', title: 'Sound Board', description: 'Play with nostalgic sounds from the early internet!' }
  ]
  
  // Mouse event handlers for dog drag
  const handleDogMouseMove = useCallback((e: MouseEvent) => {
    setDogPosition(pos => ({
      x: e.clientX - dogDragOffset.x,
      y: e.clientY - dogDragOffset.y
    }))
  }, [dogDragOffset])

  const handleDogMouseUp = useCallback(() => {
    setDogDragging(false)
    document.removeEventListener('mousemove', handleDogMouseMove)
    document.removeEventListener('mouseup', handleDogMouseUp)
  }, [handleDogMouseMove])

  const handleDogMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    setDogDragging(true)
    setDogDragOffset({
      x: e.clientX - dogPosition.x,
      y: e.clientY - dogPosition.y
    })
    setShowWoof(true)
    setTimeout(() => setShowWoof(false), 1000)
    document.addEventListener('mousemove', handleDogMouseMove)
    document.addEventListener('mouseup', handleDogMouseUp)
  }
  
  return (
    <div id="desktop" onMouseMove={handleMouseMove}>
      {/* Draggable Dog GIF */}
      <div style={{
        position: 'absolute',
        left: dogPosition.x,
        top: dogPosition.y,
        zIndex: 9999,
        userSelect: 'none',
        pointerEvents: 'auto',
      }}>
        {showWoof && (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '-30px',
            transform: 'translateX(-50%)',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '12px',
            padding: '2px 10px',
            fontSize: '14px',
            boxShadow: '1px 1px 4px rgba(0,0,0,0.1)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            woof
          </div>
        )}
        <img
          src="/icons/dog.gif"
          alt="Dog"
          style={{
            width: '64px',
            height: '64px',
            cursor: 'grab',
            userSelect: 'none',
            pointerEvents: 'auto',
          }}
          onMouseDown={handleDogMouseDown}
          draggable={false}
        />
      </div>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-item" onClick={() => openWindow('main')}>
          <img src="/icons/home.png" alt="Home" />
          <div className="sidebar-label">Home</div>
        </div>
        
        <div className="sidebar-item" onClick={() => openWindow('games')}>
          <img src="/icons/games.png" alt="Games" />
          <div className="sidebar-label">Games</div>
        </div>
        
        <div className="sidebar-item" onClick={() => openWindow('guestbook')}>
          <img src="/icons/guestbook.png" alt="Guestbook" />
          <div className="sidebar-label">Guestbook</div>
        </div>
      </div>
      
      {/* Main Window */}
      <div 
        className={`window ${activeWindow === 'main' ? 'active' : ''}`} 
        style={{
          top: windowPositions.main.top,
          left: windowPositions.main.left,
          width: windowPositions.main.width,
          height: windowPositions.main.height,
          zIndex: windowPositions.main.zIndex
        }}
      >
        <div 
          className="window-header"
          onMouseDown={(e) => startDrag(e, 'main')}
        >
          <div className="window-header-title">
            <img src="/icons/home.png" alt="" />
            BubbleNet 2000 - Home
          </div>
          <div className="window-controls">
            <div className="window-control">_</div>
            <div className="window-control">□</div>
            <div className="window-control" onClick={() => closeWindow('main')}>×</div>
          </div>
        </div>
        
        <div className="window-content">
          <h1 style={{ 
            textAlign: 'center', 
            color: 'var(--hot-pink)',
            fontFamily: '"Comic Sans MS", cursive',
            marginBottom: '10px',
            textShadow: '1px 1px 1px #ff99cc',
            fontSize: '24px'
          }}>
            <span className="sparkle">BubbleNet 2000</span>
          </h1>
          
          <div className="under-construction">
            🚧 This website is under construction! 🚧
          </div>
          
          <div className="marquee-container">
            <div className="marquee">
              ★★★ Welcome to BubbleNet 2000! The ultimate Y2K gaming experience! ★★★ Made with love by a fan of the early internet! ★★★ Don't forget to sign our guestbook! ★★★
            </div>
          </div>
          
          <p style={{ 
            textAlign: 'center', 
            margin: '10px 0',
            fontFamily: '"Comic Sans MS", cursive',
            color: 'var(--purple)'
          }}>
            Welcome to the ultimate Y2K gaming paradise! <br />
            Choose a game from our collection and enjoy the nostalgia!
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
            <button 
              className="y2k-button" 
              onClick={() => openWindow('games')}
              style={{ marginRight: '10px' }}
            >
              Play Games!
            </button>
            
            <button 
              className="y2k-button"
              onClick={() => openWindow('guestbook')}
            >
              Sign Guestbook!
            </button>
          </div>
          
          <div style={{ 
            border: '1px solid #cccccc',
            padding: '10px',
            margin: '10px 0',
            backgroundColor: '#f9f9f9'
          }}>
            <h2 style={{ 
              color: 'var(--cyber-blue)',
              fontSize: '14px',
              marginBottom: '5px',
              borderBottom: '1px solid #cccccc'
            }}>
              Announcements
            </h2>
            
            <ul style={{ paddingLeft: '20px', fontSize: '11px' }}>
              <li>NEW! Memory Match game added to our collection!</li>
              <li>Fixed bugs in the Y2K Snake game</li>
              <li>Guestbook now available! Share your thoughts!</li>
              <li>Coming Soon: Y2K-themed chat room!</li>
            </ul>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <div className="visitor-counter">
              Visitors: {visitorCount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Games Window */}
      <div 
        className={`window ${activeWindow === 'games' ? 'active' : ''}`} 
        style={{
          top: windowPositions.games.top,
          left: windowPositions.games.left,
          width: windowPositions.games.width,
          height: windowPositions.games.height,
          zIndex: windowPositions.games.zIndex
        }}
      >
        <div 
          className="window-header"
          onMouseDown={(e) => startDrag(e, 'games')}
        >
          <div className="window-header-title">
            <img src="/icons/games.png" alt="" />
            BubbleNet 2000 - Games
          </div>
          <div className="window-controls">
            <div className="window-control">_</div>
            <div className="window-control">□</div>
            <div className="window-control" onClick={() => closeWindow('games')}>×</div>
          </div>
        </div>
        
        <div className="window-content">
          <h2 style={{ 
            textAlign: 'center', 
            color: 'var(--purple)',
            marginBottom: '10px',
            fontSize: '16px'
          }}>
            Choose a Game to Play!
          </h2>
          
          <div className="game-container">
            {games.map(game => (
              <div key={game.id} className="game-card">
                <div className="game-header">
                  {game.title}
                </div>
                <div className="game-content">
                  <div className="game-icon">
                    {game.id === 'memory' && '🔮'}
                    {game.id === 'snake' && '🐍'}
                    {game.id === 'painter' && '🎨'}
                    {game.id === 'quiz' && '💿'}
                    {game.id === 'sound' && '🔊'}
                  </div>
                  <div className="game-title">{game.title}</div>
                  <div className="game-description">{game.description}</div>
                  <Link to={`/game/${game.id}`} style={{ textDecoration: 'none' }}>
                    <button className="game-button">Play Now!</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Guestbook Window */}
      <div 
        className={`window ${activeWindow === 'guestbook' ? 'active' : ''}`} 
        style={{
          top: windowPositions.guestbook.top,
          left: windowPositions.guestbook.left,
          width: windowPositions.guestbook.width,
          height: windowPositions.guestbook.height,
          zIndex: windowPositions.guestbook.zIndex
        }}
      >
        <div 
          className="window-header"
          onMouseDown={(e) => startDrag(e, 'guestbook')}
        >
          <div className="window-header-title">
            <img src="/icons/guestbook.png" alt="" />
            BubbleNet 2000 - Guestbook
          </div>
          <div className="window-controls">
            <div className="window-control">_</div>
            <div className="window-control">□</div>
            <div className="window-control" onClick={() => closeWindow('guestbook')}>×</div>
          </div>
        </div>
        
        <div className="window-content">
          <h2 style={{ 
            textAlign: 'center', 
            color: 'var(--hot-pink)',
            marginBottom: '10px',
            fontSize: '16px'
          }}>
            Sign Our Guestbook!
          </h2>
          
          <div style={{ 
            border: '1px solid #cccccc',
            padding: '8px',
            backgroundColor: '#f9f9f9',
            fontSize: '11px',
            marginBottom: '10px'
          }}>
            <p><b>Katie:</b> OMG I luv this site!! The games are so fun!! &lt;3</p>
            <p><b>XxCoolDude99xX:</b> awesome y2k vibes! brings back memories!</p>
            <p><b>~*PrincessStar*~:</b> this is like soooo cool! add more games plz!</p>
            <p><b>ComputerWhiz:</b> Nice retro design! Takes me back to 2000!</p>
          </div>
          
          <form style={{ 
            border: '1px solid #cccccc',
            padding: '8px',
            backgroundColor: '#f0f0f0'
          }}>
            <div style={{ marginBottom: '5px' }}>
              <label style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>
                Your Name:
              </label>
              <input 
                type="text" 
                style={{ 
                  width: '100%',
                  padding: '3px',
                  border: '1px inset #cccccc'
                }} 
              />
            </div>
            
            <div style={{ marginBottom: '5px' }}>
              <label style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>
                Your Message:
              </label>
              <textarea 
                style={{ 
                  width: '100%',
                  height: '60px',
                  padding: '3px',
                  border: '1px inset #cccccc'
                }} 
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <div>
                <input type="checkbox" id="email-updates" />
                <label htmlFor="email-updates" style={{ fontSize: '10px', marginLeft: '3px' }}>
                  Email me updates!
                </label>
              </div>
              <button 
                className="game-button"
                style={{ marginLeft: 'auto' }}
              >
                Sign Guestbook!
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Glitter effect particles */}
      {showGlitter.map(glitter => (
        <div 
          key={glitter.id}
          className="glitter"
          style={{
            left: `${glitter.x}px`,
            top: `${glitter.y}px`
          }}
        />
      ))}
      
      {/* Taskbar */}
      <div className="taskbar">
        <div className="start-button">
          <img src="/icons/start.png" alt="Start" />
          Start
        </div>
        
        <div className="taskbar-divider"></div>
        
        <div style={{ 
          padding: '2px 8px',
          backgroundColor: windowPositions.main.top !== '-100px' ? '#eeeeee' : 'transparent',
          border: windowPositions.main.top !== '-100px' ? '1px inset #ffffff' : 'none',
          fontSize: '11px',
          marginRight: '3px',
          height: '22px',
          display: 'flex',
          alignItems: 'center'
        }}
        onClick={() => openWindow('main')}
        >
          <img src="/icons/home.png" alt="" style={{ width: '16px', height: '16px', marginRight: '3px' }} />
          BubbleNet 2000
        </div>
        
        {windowPositions.games.top !== '-1000px' && (
          <div style={{ 
            padding: '2px 8px',
            backgroundColor: activeWindow === 'games' ? '#eeeeee' : 'transparent',
            border: activeWindow === 'games' ? '1px inset #ffffff' : 'none',
            fontSize: '11px',
            marginRight: '3px',
            height: '22px',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => openWindow('games')}
          >
            <img src="/icons/games.png" alt="" style={{ width: '16px', height: '16px', marginRight: '3px' }} />
            Games
          </div>
        )}
        
        {windowPositions.guestbook.top !== '-1000px' && (
          <div style={{ 
            padding: '2px 8px',
            backgroundColor: activeWindow === 'guestbook' ? '#eeeeee' : 'transparent',
            border: activeWindow === 'guestbook' ? '1px inset #ffffff' : 'none',
            fontSize: '11px',
            marginRight: '3px',
            height: '22px',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => openWindow('guestbook')}
          >
            <img src="/icons/guestbook.png" alt="" style={{ width: '16px', height: '16px', marginRight: '3px' }} />
            Guestbook
          </div>
        )}
        
        <div className="clock">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

export default HomePage