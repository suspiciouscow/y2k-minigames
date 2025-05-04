import { useState, useEffect, useRef } from 'react'

interface Song {
  title: string;
  url: string;
}

interface Position {
  x: number;
  y: number;
}

const MP3Player = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 10, y: 10 })
  const [showPlayer, setShowPlayer] = useState(false)
  const [currentSong, setCurrentSong] = useState(0)
  const dragStartPos = useRef<Position>({ x: 0, y: 0 })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // List of MP3 songs
  const songs: Song[] = [
    { title: "Crank That Soulja Boy", url: "/sounds/Soulja Boy - Crank That Now Watch Me You Crank That Soulja Boy (Lyrics)  Tiktok Song.mp3" },
    { title: "Bye Bye Bye", url: "/sounds/NSYNC - Bye Bye Bye (Official Video).mp3" },
    { title: "Oops!... I Did It Again", url: "/sounds/Britney Spears - Oops!... I Did It Again (Lyrics).mp3" }
  ]
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(songs[currentSong].url)
    audioRef.current.loop = true
    audioRef.current.volume = 0.3
    
    // Show player after 3 seconds
    const timer = setTimeout(() => {
      setShowPlayer(true)
    }, 3000)
    
    return () => {
      clearTimeout(timer)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])
  
  // Handle song change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = new Audio(songs[currentSong].url)
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
      
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentSong])
  
  // Play/pause the MP3
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }
  
  // Change to the next song
  const nextSong = () => {
    setCurrentSong((currentSong + 1) % songs.length)
  }
  
  // Change to the previous song
  const prevSong = () => {
    setCurrentSong((currentSong - 1 + songs.length) % songs.length)
  }
  
  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    const rect = e.currentTarget.getBoundingClientRect()
    dragStartPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }
  
  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y
      })
    }
  }
  
  // Handle mouse up for dragging
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  // Add/remove event listeners based on dragging state
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])
  
  // Hide the player
  const hidePlayer = () => {
    setShowPlayer(false)
  }
  
  // Show the player
  const showPlayerAgain = () => {
    setShowPlayer(true)
  }
  
  if (!showPlayer) {
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: '#d4d0c8',
          border: '2px outset #ffffff',
          padding: '2px 8px',
          fontSize: '11px',
          cursor: 'pointer',
          fontFamily: '"MS Sans Serif", Arial, sans-serif',
          boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)'
        }}
        onClick={showPlayerAgain}
      >
        Show MP3 Player
      </div>
    )
  }
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: 1000,
        width: '220px',
        backgroundColor: '#d4d0c8',
        border: '2px outset #ffffff',
        boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.3)',
        fontFamily: '"MS Sans Serif", Arial, sans-serif',
        fontSize: '11px'
      }}
    >
      {/* Title bar */}
      <div 
        style={{
          backgroundColor: isDragging ? '#000080' : '#000084',
          color: 'white',
          padding: '3px 5px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'move',
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '11px' }}>🎵 MP3 Player</span>
        </div>
        <div style={{ display: 'flex' }}>
          <div 
            style={{
              width: '14px',
              height: '14px',
              backgroundColor: '#d4d0c8',
              border: '1px outset #ffffff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '2px',
              fontSize: '9px',
              cursor: 'pointer'
            }}
            onClick={hidePlayer}
          >
            _
          </div>
          <div 
            style={{
              width: '14px',
              height: '14px',
              backgroundColor: '#d4d0c8',
              border: '1px outset #ffffff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '2px',
              fontSize: '9px',
              cursor: 'pointer'
            }}
            onClick={hidePlayer}
          >
            ×
          </div>
        </div>
      </div>
      
      {/* Player content */}
      <div style={{ padding: '10px' }}>
        {/* Song display */}
        <div 
          style={{
            backgroundColor: 'black',
            color: '#33ff00',
            fontFamily: '"Courier New", monospace',
            padding: '5px',
            marginBottom: '10px',
            height: '20px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            border: '1px inset #999999'
          }}
        >
          {isPlaying ? '▶ ' : '❚❚ '}{songs[currentSong].title}
        </div>
        
        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            style={{
              backgroundColor: '#d4d0c8',
              border: '2px outset #ffffff',
              width: '30px',
              height: '20px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '11px'
            }}
            onClick={prevSong}
          >
            ◀◀
          </button>
          
          <button 
            style={{
              backgroundColor: '#d4d0c8',
              border: '2px outset #ffffff',
              width: '30px',
              height: '20px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '11px'
            }}
            onClick={togglePlay}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>
          
          <button 
            style={{
              backgroundColor: '#d4d0c8',
              border: '2px outset #ffffff',
              width: '30px',
              height: '20px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '11px'
            }}
            onClick={nextSong}
          >
            ▶▶
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '5px' }}>Vol:</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="30"
              style={{ width: '60px' }}
              onChange={(e) => {
                if (audioRef.current) {
                  audioRef.current.volume = Number(e.target.value) / 100
                }
              }}
            />
          </div>
        </div>
        
        <div style={{ 
          marginTop: '8px',
          fontSize: '9px',
          color: '#666666',
          textAlign: 'center'
        }}>
          BubbleNet 2000 MP3 Collection
        </div>
      </div>
    </div>
  )
}

export default MP3Player