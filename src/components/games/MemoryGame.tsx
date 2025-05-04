import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Card {
  id: number;
  icon: string;
  flipped: boolean;
  solved: boolean;
}

const MemoryGame = () => {
  // Game state
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [solved, setSolved] = useState<string[]>([])
  const [disabled, setDisabled] = useState(false)
  const [moves, setMoves] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  
  // Y2K themed icons
  const y2kIcons = [
    '💾', '📟', '📠', '📱', '💿', '📼', 
    '🔮', '👾', '🎮', '🖥️', '📺', '📻'
  ]
  
  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])
  
  // Check if game is over
  useEffect(() => {
    if (solved.length > 0 && solved.length === cards.length / 2) {
      setEndTime(Date.now())
      setGameOver(true)
    }
  }, [solved, cards])
  
  // Initialize the game board
  const initializeGame = () => {
    // Reset game state
    setFlipped([])
    setSolved([])
    setDisabled(false)
    setGameOver(false)
    setMoves(0)
    setStartTime(Date.now())
    setEndTime(null)
    
    // Create and shuffle card deck
    const selectedIcons = y2kIcons.slice(0, 6) // Use 6 pairs for a 4x3 grid
    const cardDeck = [...selectedIcons, ...selectedIcons]
      .map((icon, index) => ({ id: index, icon, flipped: false, solved: false }))
    
    // Shuffle cards
    for (let i = cardDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]]
    }
    
    setCards(cardDeck)
  }
  // Handle card click
  const handleCardClick = (id: number) => {
    // Prevent clicks if game is disabled
    if (disabled) return
    
    // Prevent clicking already flipped or solved cards
    if (flipped.includes(id) || solved.includes(cards[id].icon)) return
    
    // Add card to flipped array
    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)
    
    // If 2 cards are flipped, check for match
    if (newFlipped.length === 2) {
      setDisabled(true)
      setMoves(moves + 1)
      
      const [first, second] = newFlipped
      
      // Check if cards match
      if (cards[first].icon === cards[second].icon) {
        setSolved([...solved, cards[first].icon])
        setFlipped([])
        setDisabled(false)
      } else {
        // If no match, flip cards back
        setTimeout(() => {
          setFlipped([])
          setDisabled(false)
        }, 1000)
      }
    }
  }
  
  // Calculate game time
  const getGameTime = () => {
    if (!startTime) return '0:00'
    const totalSeconds = Math.floor(((endTime || Date.now()) - startTime) / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }
  
  // Render game over screen
  const renderGameOver = () => (
    <div className="card" style={{ 
      textAlign: 'center',
      padding: '30px',
      marginTop: '20px'
    }}>
      <h2 className="y2k-header floating">You Win!</h2>
      
      <div style={{ fontSize: '4rem', margin: '20px 0' }}>
        🏆
      </div>
      
      <div style={{
        background: 'linear-gradient(135deg, #fff0fb 0%, #f0f4ff 100%)',
        padding: '20px',
        borderRadius: '15px',
        border: '2px solid var(--primary)',
        maxWidth: '300px',
        margin: '0 auto 30px auto'
      }}>
        <p className="rainbow-text" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
          Game Stats
        </p>
        <p style={{ margin: '10px 0' }}>
          <strong>Moves:</strong> {moves}
        </p>
        <p style={{ margin: '10px 0' }}>
          <strong>Time:</strong> {getGameTime()}
        </p>
      </div>
      
      <button onClick={initializeGame} className="btn" style={{ margin: '0 10px' }}>
        Play Again
      </button>
      
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button className="btn" style={{ margin: '0 10px' }}>
          Back to Games
        </button>
      </Link>
    </div>
  )
  
  // Render game board
  const renderGameBoard = () => (
    <div className="card" style={{ 
      textAlign: 'center',
      padding: '20px',
      marginTop: '20px'
    }}>
      <h2 className="y2k-header">Memory Match</h2>
      
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        margin: '20px 0'
      }}>
        <div className="visitor-counter" style={{ animation: 'none' }}>
          Moves: {moves}
        </div>
        <div className="visitor-counter" style={{ animation: 'none' }}>
          Time: {getGameTime()}
        </div>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        margin: '20px 0'
      }}>
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            style={{
              height: '80px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '2rem',
              backgroundColor: flipped.includes(index) || solved.includes(card.icon)
                ? 'white'
                : 'linear-gradient(45deg, var(--primary), var(--secondary))',
              border: '2px solid',
              borderColor: solved.includes(card.icon)
                ? 'var(--accent)'
                : 'var(--primary)',
              boxShadow: solved.includes(card.icon)
                ? '0 0 10px var(--accent)'
                : '3px 3px 0 var(--secondary)',
              transition: 'all 0.3s ease',
              transform: solved.includes(card.icon)
                ? 'scale(0.95)'
                : flipped.includes(index)
                  ? 'scale(1.05) rotate(-2deg)'
                  : 'scale(1)',
            }}
          >
            {(flipped.includes(index) || solved.includes(card.icon)) && card.icon}
          </div>
        ))}
      </div>
      
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button className="btn">
          Back to Games
        </button>
      </Link>
    </div>
  )
  
  return (
    <div className="container">
      {gameOver ? renderGameOver() : renderGameBoard()}
    </div>
  )
}

export default MemoryGame