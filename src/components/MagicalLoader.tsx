import React from 'react'

export function MagicalLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center z-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/6 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Loader */}
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-32 h-32 border-4 border-purple-500/30 rounded-full animate-spin">
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        {/* Middle Ring */}
        <div className="absolute inset-2 w-28 h-28 border-4 border-pink-500/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}>
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-pink-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        {/* Inner Ring */}
        <div className="absolute inset-4 w-24 h-24 border-4 border-indigo-500/50 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-indigo-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Center Orb */}
        <div className="absolute inset-8 w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full animate-ping" />
        </div>

        {/* Lightning Effects */}
        <div className="absolute -inset-8">
          <div className="absolute top-0 left-1/2 w-1 h-16 bg-gradient-to-b from-yellow-400 to-transparent transform -translate-x-1/2 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-0 left-1/2 w-1 h-16 bg-gradient-to-t from-yellow-400 to-transparent transform -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute left-0 top-1/2 w-16 h-1 bg-gradient-to-r from-yellow-400 to-transparent transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute right-0 top-1/2 w-16 h-1 bg-gradient-to-l from-yellow-400 to-transparent transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Loading Text */}
      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2 animate-pulse">
            MYNE7X
          </h2>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-purple-300 text-sm mt-2 animate-pulse">Initializing the Galaxy...</p>
        </div>
      </div>

      {/* Magical Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}