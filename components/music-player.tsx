"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc } from "lucide-react"

const MAX_FILES = 50

function nameFromFile(filename: string) {
  const name = filename.replace(/\.\w+$/, "")
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
}

async function discoverTracks(): Promise<{ title: string; src: string }[]> {
  const tracks: { title: string; src: string }[] = []
  const checks = []

  for (let i = 1; i <= MAX_FILES; i++) {
    const src = `/audio/audio${i}.mp3`
    checks.push(
      fetch(src, { method: "HEAD" })
        .then(res => {
          if (res.ok) tracks.push({ title: nameFromFile(`audio${i}`), src })
        })
        .catch(() => {})
    )
  }

  await Promise.all(checks)
  return tracks
}

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [tracks, setTracks] = useState<{ title: string; src: string }[]>([])
  const [ready, setReady] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const startedRef = useRef(false)
  const trackIndexRef = useRef(0)

  const playIndex = (index: number) => {
    const audio = audioRef.current
    const track = tracks[index]
    if (!audio || !track) return
    trackIndexRef.current = index
    setTrackIndex(index)
    audio.src = track.src
    audio.load()
    audio.play().then(() => {
      setPlaying(true)
      startedRef.current = true
    }).catch(() => {
      setPlaying(false)
    })
  }

  useEffect(() => {
    discoverTracks().then(found => {
      if (found.length > 0) {
        setTracks(found)
        setReady(true)
      }
    })
  }, [])

  useEffect(() => {
    if (!ready || tracks.length === 0) return
    const audio = new Audio()
    audio.volume = 0.3
    audioRef.current = audio

    const handleInteraction = () => {
      if (startedRef.current) return
      playIndex(0)
    }

    const handleEnded = () => {
      const next = (trackIndexRef.current + 1) % tracks.length
      playIndex(next)
    }
    audio.addEventListener("ended", handleEnded)

    document.addEventListener("click", handleInteraction, { once: true })
    document.addEventListener("touchstart", handleInteraction, { once: true })

    return () => {
      audio.pause()
      audio.src = ""
      audio.removeEventListener("ended", handleEnded)
    }
  }, [ready])

  if (!ready) return null

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  const next = () => playIndex((trackIndex + 1) % tracks.length)
  const prev = () => playIndex((trackIndex - 1 + tracks.length) % tracks.length)

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !muted
    setMuted(!muted)
  }

  return (
    <div suppressHydrationWarning className="fixed bottom-6 right-6 z-[999] flex items-center gap-2 bg-[#1a1428]/90 backdrop-blur-lg border border-[#a855f7]/30 rounded-full px-4 py-2 shadow-lg shadow-[#a855f7]/10 animate-fade-in">
      <Disc className={`w-4 h-4 text-[#a855f7] shrink-0 ${playing ? "animate-spin" : ""}`} style={{ animationDuration: "4s" }} />
      <span className="text-xs text-[#9ca3af] max-w-[100px] truncate hidden sm:block">
        {tracks[trackIndex]?.title || ""}
      </span>
      <button suppressHydrationWarning onClick={togglePlay} className="p-1.5 rounded-full hover:bg-[#2d1f4a] transition-colors text-white" title={playing ? "Tạm dừng" : "Phát"}>
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <button suppressHydrationWarning onClick={prev} className="p-1.5 rounded-full hover:bg-[#2d1f4a] transition-colors text-white" title="Bài trước">
        <SkipBack className="w-4 h-4" />
      </button>
      <button suppressHydrationWarning onClick={next} className="p-1.5 rounded-full hover:bg-[#2d1f4a] transition-colors text-white" title="Bài tiếp">
        <SkipForward className="w-4 h-4" />
      </button>
      <button suppressHydrationWarning onClick={toggleMute} className="p-1.5 rounded-full hover:bg-[#2d1f4a] transition-colors text-white" title={muted ? "Bật âm" : "Tắt âm"}>
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  )
}