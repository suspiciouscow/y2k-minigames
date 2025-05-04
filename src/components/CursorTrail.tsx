import { useState, useEffect } from 'react'

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  lifetime: number;
}

const CursorTrail = () => {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', updateMousePosition)
    
    const particleInterval = setInterval(() => {
      // Add new particle
      const newParticle = {
        id: Date.now(),
        x: mousePosition.x,
        y: mousePosition.y,
        size: Math.random() * 8 + 5,
        color: getRandomColor(),
        rotation: Math.random() * 360,
        lifetime: 0
      }
      
      // Update particles
      setParticles(prevParticles => {
        // Add new particle and remove old ones
        const updatedParticles = [...prevParticles, newParticle]
          .map(particle => ({
            ...particle,
            lifetime: particle.lifetime + 1,
            x: particle.x + (Math.random() * 3 - 1.5),
            y: particle.y + (Math.random() * 3 - 1.5),
            rotation: particle.rotation + 5
          }))
          .filter(particle => particle.lifetime < 15)
        
        return updatedParticles
      })
    }, 70)
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      clearInterval(particleInterval)
    }
  }, [mousePosition])
  
  // Get a random Y2K-themed color
  const getRandomColor = () => {
    const colors = [
      '#ff33cc', // hot pink
      '#33ccff', // cyber blue
      '#9933ff', // purple
      '#ff9900', // orange
      '#ff6699', // pink
      '#66ff33'  // lime
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  // Star shape SVG path
  const createStarPath = () => {
    return "M10,1 L12,7 L18,7 L13,11 L15,17 L10,13 L5,17 L7,11 L2,7 L8,7 Z";
  }
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none', 
      zIndex: 9999 
    }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: 1 - particle.lifetime / 15,
            transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
            pointerEvents: 'none'
          }}
        >
          <svg viewBox="0 0 20 20" width="100%" height="100%">
            <path 
              d={createStarPath()} 
              fill={particle.color} 
              stroke="#ffffff" 
              strokeWidth="0.5"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}

export default CursorTrail