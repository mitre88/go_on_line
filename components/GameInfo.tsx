'use client';

import { GameState, calculateScore } from '@/lib/goGame';
import { motion } from 'framer-motion';

interface GameInfoProps {
  gameState: GameState;
  onPass: () => void;
  onNewGame: () => void;
  isAiThinking: boolean;
}

export default function GameInfo({ gameState, onPass, onNewGame, isAiThinking }: GameInfoProps) {
  const score = calculateScore(gameState.board);
  const totalBlackScore = score.black + gameState.capturedWhite;
  const totalWhiteScore = score.white + gameState.capturedBlack;

  return (
    <div className="space-y-6">
      {/* Título */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <motion.h1
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2"
          style={{ backgroundSize: '200% auto' }}
        >
          GO Online
        </motion.h1>
        <p className="text-sm text-gray-300 flex items-center justify-center gap-2">
          <span className="inline-block">⚡</span>
          Powered by AI
          <span className="inline-block">✨</span>
        </p>
      </motion.div>

      {/* Información del turno */}
      <motion.div
        className="card relative overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ backgroundSize: '200% auto' }}
        />
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
            <span className="text-2xl">🎯</span>
            Turno Actual
          </h2>
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: gameState.currentPlayer === 'black'
                  ? ['0 0 0 0 rgba(168, 85, 247, 0)', '0 0 0 10px rgba(168, 85, 247, 0)', '0 0 0 0 rgba(168, 85, 247, 0)']
                  : ['0 0 0 0 rgba(236, 72, 153, 0)', '0 0 0 10px rgba(236, 72, 153, 0)', '0 0 0 0 rgba(236, 72, 153, 0)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-10 h-10 rounded-full ${
                gameState.currentPlayer === 'black'
                  ? 'bg-gradient-to-br from-gray-700 via-gray-900 to-black'
                  : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
              } shadow-xl`}
            />
            <span className="text-2xl font-bold">
              {gameState.currentPlayer === 'black' ? '🎮 Jugador (Negro)' : '🤖 IA (Blanco)'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Puntajes */}
      <motion.div
        className="card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
          <span className="text-2xl">🏆</span>
          Puntajes
        </h2>
        <div className="space-y-4">
          {/* Jugador Negro */}
          <motion.div
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-transparent border border-purple-400/30"
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 via-gray-900 to-black shadow-lg"
              />
              <span className="font-bold text-lg">🎮 Jugador</span>
            </div>
            <div className="text-right">
              <motion.div
                key={totalBlackScore}
                initial={{ scale: 1.2, color: '#a855f7' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="text-3xl font-extrabold"
              >
                {totalBlackScore.toFixed(1)}
              </motion.div>
              <div className="text-xs text-gray-300">
                🎯 {score.black.toFixed(1)} + ⚔️ {gameState.capturedWhite}
              </div>
            </div>
          </motion.div>

          {/* Jugador Blanco */}
          <motion.div
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-transparent border border-pink-400/30"
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-50 via-white to-gray-100 shadow-lg"
              />
              <span className="font-bold text-lg">🤖 IA</span>
            </div>
            <div className="text-right">
              <motion.div
                key={totalWhiteScore}
                initial={{ scale: 1.2, color: '#ec4899' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="text-3xl font-extrabold"
              >
                {totalWhiteScore.toFixed(1)}
              </motion.div>
              <div className="text-xs text-gray-300">
                🎯 {score.white.toFixed(1)} + ⚔️ {gameState.capturedBlack}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        className="card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
          <span className="text-2xl">📊</span>
          Estadísticas
        </h2>
        <div className="space-y-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex justify-between items-center p-2 rounded-lg bg-blue-500/10 border border-blue-400/20"
          >
            <span className="text-gray-200 flex items-center gap-2">
              <span>🎲</span> Movimientos:
            </span>
            <span className="font-bold text-xl text-blue-300">{gameState.moveHistory.length}</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex justify-between items-center p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/20"
          >
            <span className="text-gray-200 flex items-center gap-2">
              <span>⏭️</span> Pases consecutivos:
            </span>
            <span className="font-bold text-xl text-cyan-300">{gameState.passes}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Botones de acción */}
      <motion.div
        className="space-y-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={onPass}
          disabled={isAiThinking || gameState.currentPlayer === 'white'}
          className="button-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pasar Turno
        </button>

        <button onClick={onNewGame} className="button-primary w-full">
          Nuevo Juego
        </button>

        {/* Botón de donación */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(251, 146, 60, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open('https://buy.stripe.com/9B63cvcLObRc8ZJ81bfbq0b', '_blank')}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white shadow-lg transition-all duration-300"
        >
          <span className="text-xl">☕</span>
          <span>Apóyame</span>
          <span className="text-lg">💝</span>
        </motion.button>
      </motion.div>

      {/* Mensaje de fin de juego */}
      {gameState.passes >= 2 && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="card relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: '200% auto' }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3), transparent 70%)',
            }}
          />
          <div className="relative z-10 text-center py-4">
            <motion.h3
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-3xl font-extrabold mb-4 text-white drop-shadow-lg"
            >
              ✨ ¡Juego Terminado! ✨
            </motion.h3>
            <motion.p
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-4xl font-black mb-3"
            >
              {totalBlackScore > totalWhiteScore
                ? '🎉 ¡GANASTE! 🏆'
                : totalWhiteScore > totalBlackScore
                ? '🤖 IA GANA 🎯'
                : '🤝 ¡EMPATE! 🤝'}
            </motion.p>
            <p className="text-2xl font-bold bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
              {totalBlackScore.toFixed(1)} - {totalWhiteScore.toFixed(1)}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
