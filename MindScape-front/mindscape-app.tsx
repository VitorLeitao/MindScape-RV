"use client"

import { useState } from "react"
import { Cloud, Waves, Trees, Wind, Flame, Mountain } from "lucide-react"

const soundscapes = [
  {
    id: "rain",
    icon: Cloud,
    gradient: "from-slate-400 to-slate-600",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-slate-100",
  },
  {
    id: "ocean",
    icon: Waves,
    gradient: "from-blue-400 to-blue-600",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-blue-100",
  },
  {
    id: "forest",
    icon: Trees,
    gradient: "from-green-400 to-green-600",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-green-100",
  },
  {
    id: "wind",
    icon: Wind,
    gradient: "from-gray-300 to-gray-500",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-gray-100",
  },
  {
    id: "fire",
    icon: Flame,
    gradient: "from-orange-400 to-red-500",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-orange-100",
  },
  {
    id: "mountain",
    icon: Mountain,
    gradient: "from-indigo-400 to-purple-500",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-indigo-100",
  },
]

export default function Component() {
  const [activeSoundscape, setActiveSoundscape] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSoundscapeClick = (id: string) => {
    setActiveSoundscape(id)
    setIsPlaying(true)

    // Simular início do áudio
    setTimeout(() => {
      // Interface ficará mais suave após 2 segundos
    }, 2000)
  }

  const handleStopPlaying = () => {
    setIsPlaying(false)
    setActiveSoundscape(null)
  }

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${
        isPlaying ? "bg-black/90" : "bg-gradient-to-br from-slate-50 via-blue-50 to-green-50"
      }`}
    >
      {/* Header */}
      <div
        className={`text-center pt-12 pb-8 transition-opacity duration-1000 ${
          isPlaying ? "opacity-20" : "opacity-100"
        }`}
      >
        <h1 className="text-2xl font-light text-slate-700 tracking-wide">MindScape</h1>
        <div className="w-16 h-0.5 bg-slate-300 mx-auto mt-2"></div>
      </div>

      {/* Soundscape Grid */}
      <div
        className={`px-6 transition-all duration-1000 ${isPlaying ? "opacity-30 scale-95" : "opacity-100 scale-100"}`}
      >
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {soundscapes.map((soundscape) => {
            const IconComponent = soundscape.icon
            const isActive = activeSoundscape === soundscape.id

            return (
              <button
                key={soundscape.id}
                onClick={() => handleSoundscapeClick(soundscape.id)}
                className={`
                  relative aspect-square rounded-3xl overflow-hidden
                  transform transition-all duration-300 ease-out
                  ${isActive ? "scale-105 shadow-2xl" : "hover:scale-102 shadow-lg"}
                  ${soundscape.color}
                `}
              >
                {/* Background Gradient */}
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-br ${soundscape.gradient}
                  opacity-80
                `}
                />

                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <IconComponent size={48} className="text-white drop-shadow-lg" strokeWidth={1.5} />
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  </div>
                )}

                {/* Subtle Border */}
                <div className="absolute inset-0 rounded-3xl border border-white/20" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Playing State Overlay */}
      {isPlaying && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse mb-8" />
            <button
              onClick={handleStopPlaying}
              className="text-white/60 text-sm font-light tracking-wide pointer-events-auto
                         hover:text-white/80 transition-colors duration-300"
            >
              Toque para retornar
            </button>
          </div>
        </div>
      )}

      {/* Bottom Spacing */}
      <div className="h-20" />
    </div>
  )
}
