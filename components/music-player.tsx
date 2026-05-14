"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc } from "lucide-react"

const TRACKS = Array.from({ length: 10 }, (_, i) => ({
  title: `Nhạc nền ${i + 1}`,
  src: `/audio/audio${i + 1}.mp3`,
}))

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [enabled, setEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const idxRef = useRef(0)
  const startedRef = useRef(false)

  const playTrack = (i: number) => {
    const a = audioRef.current
    const t = TRACKS[i]
    if (!a || !t) return
    idxRef.current = i
    setTrackIndex(i)
    a.src = t.src
    a.load()
    a.currentTime = 0
    a.play().then(() => {
      setPlaying(true)
      startedRef.current = true
    }).catch(() => setPlaying(false))
  }

  useEffect(() => {
    const a = new Audio()
    a.volume = 0.3
    audioRef.current = a

    const wasEnabled = localStorage.getItem("musicEnabled") === "1"
    if (wasEnabled) {
      setEnabled(true)
      playTrack(0)
    }

    a.addEventListener("ended", () => playTrack((idxRef.current + 1) % TRACKS.length))

    const onInteraction = () => {
      if (startedRef.current) return
      localStorage.setItem("musicEnabled", "1")
      setEnabled(true)
      playTrack(0)
    }

    document.addEventListener("click", onInteraction, { once: true })
    document.addEventListener("touchstart", onInteraction, { once: true })

    return () => {
      a.pause()
      a.src = ""
    }
  }, [])

  const togglePlay = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      a.src = TRACKS[idxRef.current].src
      a.load()
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  const toggleEnable = () => {
    const newEnabled = !enabled
    setEnabled(newEnabled)
    localStorage.setItem("musicEnabled", newEnabled ? "1" : "0")
    if (newEnabled && !startedRef.current) {
      playTrack(0)
    } else if (!newEnabled) {
      audioRef.current?.pause()
      setPlaying(false)
    }
  }

  const next = () => playTrack((idxRef.current + 1) % TRACKS.length)
  const prev = () => playTrack((idxRef.current - 1 + TRACKS.length) % TRACKS.length)

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !muted
    setMuted(!muted)
  }

  if (!enabled) {
    return (
      <button
        suppressHydrationWarning
        onClick={toggleEnable}
        className="fixed bottom-6 right-6 z-[999] flex items-center gap-2 bg-[#1a1428]/90 backdrop-blur-lg border border-[#a855f7]/30 rounded-full px-4 py-2 shadow-lg shadow-[#a855f7]/10 animate-fade-in text-white"
      >
        <Disc className="w-4 h-4 text-[#a855f7]" />
        <span className="text-xs hidden sm:block">Bật nhạc</span>
      </button>
    )
  }

  return (
    <div suppressHydrationWarning className="fixed bottom-6 right-6 z-[999] flex items-center gap-2 bg-[#1a1428]/90 backdrop-blur-lg border border-[#a855f7]/30 rounded-full px-4 py-2 shadow-lg shadow-[#a855f7]/10 animate-fade-in">
      <Disc className={`w-4 h-4 text-[#a855f7] shrink-0 ${playing ? "animate-spin" : ""}`} style={{ animationDuration: "4s" }} />
      <span className="text-xs text-[#9ca3af] max-w-[100px] truncate hidden sm:block">
        {TRACKS[trackIndex].title}
      </span>
      <button suppressHydrationWarning onClick={togglePlay} className="p-1.5 rounded-full hover:bg-[#2d1f4a] transition-colors text-white">
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <button suppressHydrationWarning onClick={prev} className="p-1.5 rounded-full hover:bg-[#2d1f4a] transition-colors text-white">
        <SkipBack className="w-4 h-4" />
      </button>
      <button suppressHydrationWarning onClick={next} className="p-1.5 rounded-full hover:bg-[#2d1f4a] transition-colors text-white">
        <SkipForward className="w-4 h-4" />
      </button>
      <button suppressHydrationWarning onClick={toggleMute} className="p-1.5 rounded-full hover:bg-[#2d1f4a] transition-colors text-white">
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      <button suppressHydrationWarning onClick={toggleEnable} className="p-1.5 rounded-full hover:bg-[#2d1f4a] transition-colors text-white ml-1">
        <span className="text-[10px]">✕</span>
      </button>
    </div>
  )
}