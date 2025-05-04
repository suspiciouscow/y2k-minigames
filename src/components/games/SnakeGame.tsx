import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const SnakeGame = () => {
  // Canvas dimensions
  const canvasWidth = 400
  const canvasHeight = 400
  const gridSize = 20
  
  // Game state
  const [snake, setSnake] = useState([{ x: 5, y: 5 }])
  const [food, setFood] = useState({ x: 10, y: 10 })
  const [direction, setDirection] = useState('right')
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [speed, setSpeed] = useState(150)
  const [gameStarted, setGameStarted] = useState(false)
  const [windowPosition, setWindowPosition] = useState({ top: '50px', left: '150px' })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  // Game loop ref
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  // Y2K colors
  const colors = {
    snakeHead: '#ff33cc', // Hot pink
    snakeBody: '#9933ff', // Purple
    food: '#33ccff',      // Cyber blue
    background: '#000000' // Black
  }
  
  // Initialize game
  useEffect(() => {
    // Check for saved high score
    const savedHighScore = localStorage.getItem('y2kSnakeHighScore')
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }
    
    // Draw initial game state
    if (canvasRef.current) {
      drawGame()
    }
  }, [])
  
  // Main game loop
  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(() => {
        moveSnake()
      }, speed)
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [snake, direction, gameOver, isPaused, gameStarted, speed])
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted && !gameOver) {
        startGame()
      }
      
      if (isPaused && !gameOver && e.key === ' ') {
        setIsPaused(false)
        return
      }
      
      if (gameOver && e.key === ' ') {
        resetGame()
        return
      }
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'down') setDirection('up')
          break
        case 'ArrowDown':
          if (direction !== 'up') setDirection('down')
          break
        case 'ArrowLeft':
          if (direction !== 'right') setDirection('left')
          break
        case 'ArrowRight':
          if (direction !== 'left') setDirection('right')
          break
        case ' ':
          setIsPaused(!isPaused)
          break
        default:
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [direction, gameOver, isPaused, gameStarted])
  
  // Draw game
  const drawGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.fillStyle = colors.background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    // Draw grid lines
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 0.5
    
    // Vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasHeight)
      ctx.stroke()
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasWidth, y)
      ctx.stroke()
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
      // Head is a different color
      ctx.fillStyle = index === 0 ? colors.snakeHead : colors.snakeBody
      
      const segmentSize = gridSize - 2 // Slightly smaller than grid for spacing
      const x = segment.x * gridSize + 1
      const y = segment.y * gridSize + 1
      
      // Draw segment with rounded corners for the head
      if (index === 0) {
        ctx.beginPath()
        ctx.roundRect(x, y, segmentSize, segmentSize, 5)
        ctx.fill()
        
        // Add eyes to the head
        ctx.fillStyle = 'white'
        
        // Position eyes based on direction
        if (direction === 'right') {
          ctx.beginPath()
          ctx.arc(x + segmentSize - 5, y + 6, 2, 0, Math.PI * 2)
          ctx.arc(x + segmentSize - 5, y + segmentSize - 6, 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (direction === 'left') {
          ctx.beginPath()
          ctx.arc(x + 5, y + 6, 2, 0, Math.PI * 2)
          ctx.arc(x + 5, y + segmentSize - 6, 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (direction === 'up') {
          ctx.beginPath()
          ctx.arc(x + 6, y + 5, 2, 0, Math.PI * 2)
          ctx.arc(x + segmentSize - 6, y + 5, 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (direction === 'down') {
          ctx.beginPath()
          ctx.arc(x + 6, y + segmentSize - 5, 2, 0, Math.PI * 2)
          ctx.arc(x + segmentSize - 6, y + segmentSize - 5, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      } else {
        // Body segments
        ctx.fillRect(x, y, segmentSize, segmentSize)
      }
    })
    
    // Draw food
    ctx.fillStyle = colors.food
    const foodX = food.x * gridSize + 1
    const foodY = food.y * gridSize + 1
    const foodSize = gridSize - 2
    
    // Draw a star shape for food
    const centerX = foodX + foodSize / 2
    const centerY = foodY + foodSize / 2
    const spikes = 5
    const outerRadius = foodSize / 2
    const innerRadius = foodSize / 4
    
    ctx.beginPath()
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (Math.PI * i) / spikes - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    ctx.fill()
    
    // Add Y2K sparkle to food
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(centerX - 2, centerY - 2, 1, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw game overlays
    if (!gameStarted) {
      // Start screen
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      
      ctx.fillStyle = '#33ccff'
      ctx.font = 'bold 24px "Comic Sans MS", cursive'
      ctx.textAlign = 'center'
      ctx.fillText('Y2K SNAKE', canvasWidth / 2, canvasHeight / 2 - 30)
      
      ctx.fillStyle = '#ff33cc'
      ctx.font = '16px "Comic Sans MS", cursive'
      ctx.fillText('Press any arrow key to start', canvasWidth / 2, canvasHeight / 2 + 10)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px "Comic Sans MS", cursive'
      ctx.fillText('Use arrow keys to move', canvasWidth / 2, canvasHeight / 2 + 40)
      ctx.fillText('Space to pause', canvasWidth / 2, canvasHeight / 2 + 60)
    } else if (gameOver) {
      // Game over screen
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      
      ctx.fillStyle = '#ff33cc'
      ctx.font = 'bold 24px "Comic Sans MS", cursive'
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER!', canvasWidth / 2, canvasHeight / 2 - 30)
      
      ctx.fillStyle = '#33ccff'
      ctx.font = '16px "Comic Sans MS", cursive'
      ctx.fillText(`Score: ${score}`, canvasWidth / 2, canvasHeight / 2 + 10)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = '14px "Comic Sans MS", cursive'
      ctx.fillText('Press SPACE to play again', canvasWidth / 2, canvasHeight / 2 + 50)
    } else if (isPaused) {
      // Pause screen
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      
      ctx.fillStyle = '#33ccff'
      ctx.font = 'bold 24px "Comic Sans MS", cursive'
      ctx.textAlign = 'center'
      ctx.fillText('PAUSED', canvasWidth / 2, canvasHeight / 2)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = '14px "Comic Sans MS", cursive'
      ctx.fillText('Press SPACE to continue', canvasWidth / 2, canvasHeight / 2 + 30)
    }
  }
  
  // Move snake
  const moveSnake = () => {
    const newSnake = [...snake]
    const head = { ...newSnake[0] }
    
    // Move head in current direction
    switch (direction) {
      case 'up':
        head.y -= 1
        break
      case 'down':
        head.y += 1
        break
      case 'left':
        head.x -= 1
        break
      case 'right':
        head.x += 1
        break
      default:
        break
    }
    
    // Check for collision with walls
    if (
      head.x < 0 || 
      head.x >= canvasWidth / gridSize || 
      head.y < 0 || 
      head.y >= canvasHeight / gridSize
    ) {
      // Game over
      handleGameOver()
      return
    }
    
    // Check for collision with self
    for (let i = 1; i < newSnake.length; i++) {
      if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
        // Game over
        handleGameOver()
        return
      }
    }
    
    // Add new head
    newSnake.unshift(head)
    
    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
      // Increase score
      const newScore = score + 10
      setScore(newScore)
      
      // Increase speed every 5 food items
      if (newScore % 50 === 0 && speed > 50) {
        setSpeed(speed - 10)
      }
      
      // Generate new food
      generateFood(newSnake)
    } else {
      // Remove tail if no food was eaten
      newSnake.pop()
    }
    
    // Update snake
    setSnake(newSnake)
    
    // Update canvas
    drawGame()
  }
  
  // Generate food at random position
  const generateFood = (currentSnake: { x: number; y: number }[]) => {
    let newFood
    let validPosition = false
    
    while (!validPosition) {
      newFood = {
        x: Math.floor(Math.random() * (canvasWidth / gridSize)),
        y: Math.floor(Math.random() * (canvasHeight / gridSize))
      }
      
      // Make sure food doesn't spawn on snake
      validPosition = true
      for (const segment of currentSnake) {
        if (segment.x === newFood.x && segment.y === newFood.y) {
          validPosition = false
          break
        }
      }
    }
    
    if (newFood) {
      setFood(newFood)
    }
  }
  
  // Handle game over
  const handleGameOver = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }
    setGameOver(true)
    
    // Update high score
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('y2kSnakeHighScore', score.toString())
    }
  }
  
  // Reset game
  const resetGame = () => {
    setSnake([{ x: 5, y: 5 }])
    generateFood([{ x: 5, y: 5 }])
    setDirection('right')
    setGameOver(false)
    setIsPaused(false)
    setScore(0)
    setSpeed(150)
    setGameStarted(true)
  }
  
  // Start game
  const startGame = () => {
    setGameStarted(true)
  }
  
  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused)
  }
  
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
            src="/icons/snake.png" 
            alt="" 
            style={{ 
              width: '16px', 
              height: '16px',
              marginRight: '5px'
            }} 
          />
          <span>BubbleNet 2000 - Y2K Snake</span>
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
      
      {/* Game container */}
      <div style={{ padding: '10px' }}>
        {/* Game display */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Score display */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '10px'
            }}
          >
            <div 
              style={{
                backgroundColor: 'black',
                color: '#33ff00',
                padding: '3px 8px',
                fontFamily: '"Courier New", monospace',
                border: '1px inset #999999'
              }}
            >
              Score: {score}
            </div>
            <div 
              style={{
                backgroundColor: 'black',
                color: '#ff33cc',
                padding: '3px 8px',
                fontFamily: '"Courier New", monospace',
                border: '1px inset #999999'
              }}
            >
              Hi-Score: {highScore}
            </div>
          </div>
          
          {/* Game canvas */}
          <div 
            style={{
              border: '2px inset #999999',
              backgroundColor: 'black'
            }}
          >
            <canvas 
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
            />
          </div>
          
          {/* Game controls */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginTop: '10px'
            }}
          >
            <button 
              onClick={gameOver ? resetGame : togglePause}
              style={{
                backgroundColor: '#d4d0c8',
                border: '2px outset #ffffff',
                padding: '3px 10px',
                cursor: 'pointer',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: '12px'
              }}
            >
              {gameOver ? 'New Game' : isPaused ? 'Resume' : 'Pause'}
            </button>
            
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button 
                style={{
                  backgroundColor: '#d4d0c8',
                  border: '2px outset #ffffff',
                  padding: '3px 10px',
                  cursor: 'pointer',
                  fontFamily: '"MS Sans Serif", Arial, sans-serif',
                  fontSize: '12px'
                }}
              >
                Back to Games
              </button>
            </Link>
          </div>
          
          {/* Instructions */}
          <div 
            style={{
              marginTop: '10px',
              fontSize: '10px',
              padding: '5px',
              border: '1px solid #cccccc',
              backgroundColor: '#f0f0f0',
              width: '100%',
              textAlign: 'center'
            }}
          >
            Use arrow keys to move. Space to pause.
          </div>
        </div>
      </div>
    </div>
  )
}

export default SnakeGame