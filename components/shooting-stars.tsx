"use client"

import { useEffect, useState, useCallback } from "react"

interface ShootingStar {
  id: number
  startX: number
  startY: number
  distance: number
  angle: number
  duration: number
  size: number
  color: string
  trail: "purple" | "pink" | "cyan" | "white"
  delay: number
}

const trailColors = {
  purple: { glow: "rgba(168, 85, 247, 0.6)", tail: "rgba(168, 85, 247, 0.5)", end: "rgba(168, 85, 247, 0)" },
  pink: { glow: "rgba(236, 72, 153, 0.6)", tail: "rgba(236, 72, 153, 0.5)", end: "rgba(236, 72, 153, 0)" },
  cyan: { glow: "rgba(34, 211, 238, 0.6)", tail: "rgba(34, 211, 238, 0.5)", end: "rgba(34, 211, 238, 0)" },
  white: { glow: "rgba(255, 255, 255, 0.8)", tail: "rgba(255, 255, 255, 0.5)", end: "rgba(255, 255, 255, 0)" },
}

const getRandomArbitrary = (min: number, max: number) => Math.random() * (max - min) + min

export function ShootingStars() {
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])
  const [staticStars, setStaticStars] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setStaticStars(
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
        opacity: 0.2 + Math.random() * 0.4,
      }))
    )
  }, [])

  const createShootingStar = useCallback(() => {
    const trails: ("purple" | "pink" | "cyan" | "white")[] = ["purple", "pink", "cyan", "white"]
    const trail = trails[Math.floor(Math.random() * trails.length)]
    const size = 1.5 + Math.random() * 2.5

    const fromEdge = Math.random()
    let startX: number, startY: number
    if (fromEdge < 0.6) {
      startX = 5 + Math.random() * 80
      startY = -2 - Math.random() * 3
    } else {
      startX = 102 + Math.random() * 5
      startY = 5 + Math.random() * 50
    }

    const distance = 400 + Math.random() * 500
    const angle = 25 + Math.random() * 40

    const star: ShootingStar = {
      id: Date.now() + Math.random(),
      startX,
      startY,
      distance,
      angle,
      duration: 0.6 + Math.random() * 1.4,
      size,
      color: trail,
      trail,
      delay: Math.random() * 0.3,
    }

    setShootingStars(prev => [...prev, star])

    setTimeout(() => {
      setShootingStars(prev => prev.filter(s => s.id !== star.id))
    }, (star.duration + star.delay) * 1000 + 500)
  }, [])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const scheduleNext = () => {
      const delay = 800 + Math.random() * 2500
      timeoutId = setTimeout(() => {
        const count = Math.random() > 0.5 ? 1 : 2
        for (let i = 0; i < count; i++) {
          setTimeout(() => createShootingStar(), i * 150 + Math.random() * 100)
        }
        scheduleNext()
      }, delay)
    }

    scheduleNext()
    return () => clearTimeout(timeoutId)
  }, [createShootingStar])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {mounted && staticStars.map((star) => (
        <div
          key={`s-${star.id}`}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: star.opacity,
          }}
        />
      ))}

      {shootingStars.map((star) => {
        const c = trailColors[star.trail]
        return (
          <div
            key={star.id}
            className="absolute"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              transform: `rotate(${star.angle}deg)`,
              animationDelay: `${star.delay}s`,
              animation: `shooting-star ${star.duration}s ease-in ${star.delay}s forwards`,
              ['--dx' as string]: `${star.distance}px`,
            }}
          >
            <div
              className="absolute rounded-full bg-white"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                boxShadow: `
                  0 0 ${star.size * 3}px ${star.size * 1.5}px rgba(255, 255, 255, 0.9),
                  0 0 ${star.size * 5}px ${star.size * 2}px ${c.glow}
                `,
              }}
            />
            <div
              className="absolute top-1/2 right-full -translate-y-1/2"
              style={{
                width: `${star.size * 40}px`,
                height: `${Math.max(1, star.size * 0.6)}px`,
                background: `linear-gradient(90deg, transparent 0%, ${c.tail} 30%, ${c.glow} 100%)`,
                borderRadius: "0 50% 50% 0",
                animationDelay: `${star.delay}s`,
                animation: `shooting-star-tail ${star.duration}s ease-in ${star.delay}s forwards`,
              }}
            />
          </div>
        )
      })}

      <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)", filter: "blur(100px)" }}
      />
      <div className="absolute top-[35%] right-[5%] w-[450px] h-[450px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div className="absolute bottom-[15%] left-[35%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, transparent 70%)", filter: "blur(70px)" }}
      />
    </div>
  )
}