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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          GO Online
        </h1>
        <p className="text-sm text-gray-300">Powered by AI</p>
      </motion.div>

      {/* Información del turno */}
      <motion.div
        className="card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-3 text-center">Turno Actual</h2>
        <div className="flex items-center justify-center gap-3">
          <div
            className={`w-8 h-8 rounded-full ${
              gameState.currentPlayer === 'black'
                ? 'bg-gradient-to-br from-gray-800 to-black'
                : 'bg-gradient-to-br from-white to-gray-200'
            } shadow-lg`}
          />
          <span className="text-2xl font-bold">
            {gameState.currentPlayer === 'black' ? 'Jugador (Negro)' : 'IA (Blanco)'}
          </span>
        </div>
      </motion.div>

      {/* Puntajes */}
      <motion.div
        className="card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-3">Puntajes</h2>
        <div className="space-y-3">
          {/* Jugador Negro */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-800 to-black shadow-lg" />
              <span className="font-semibold">Jugador</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{totalBlackScore.toFixed(1)}</div>
              <div className="text-xs text-gray-400">
                Territorio: {score.black.toFixed(1)} + Capturas: {gameState.capturedWhite}
              </div>
            </div>
          </div>

          {/* Jugador Blanco */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white to-gray-200 shadow-lg" />
              <span className="font-semibold">IA</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{totalWhiteScore.toFixed(1)}</div>
              <div className="text-xs text-gray-400">
                Territorio: {score.white.toFixed(1)} + Capturas: {gameState.capturedBlack}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        className="card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-3">Estadísticas</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Movimientos:</span>
            <span className="font-semibold">{gameState.moveHistory.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Pases consecutivos:</span>
            <span className="font-semibold">{gameState.passes}</span>
          </div>
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
          onClick={() => window.open('https://donate.stripe.com/3cs8xpbHK7AU7VK7ss', '_blank')}
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
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card bg-gradient-to-r from-purple-600 to-pink-600 text-center"
        >
          <h3 className="text-2xl font-bold mb-2">¡Juego Terminado!</h3>
          <p className="text-lg">
            {totalBlackScore > totalWhiteScore
              ? '🎉 ¡Ganaste!'
              : totalWhiteScore > totalBlackScore
              ? '🤖 IA Gana'
              : '🤝 Empate'}
          </p>
          <p className="text-sm mt-2">
            {totalBlackScore.toFixed(1)} - {totalWhiteScore.toFixed(1)}
          </p>
        </motion.div>
      )}
    </div>
  );
}
