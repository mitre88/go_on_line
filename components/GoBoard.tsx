'use client';

import { GameState, Position, BOARD_SIZE } from '@/lib/goGame';
import { motion } from 'framer-motion';

interface GoBoardProps {
  gameState: GameState;
  onCellClick: (pos: Position) => void;
  isAiThinking: boolean;
}

export default function GoBoard({ gameState, onCellClick, isAiThinking }: GoBoardProps) {
  const cellSize = 55; // tamaño de cada celda en píxeles
  const stoneSize = 44; // tamaño de las piedras (80% del cellSize)

  return (
    <div className="relative">
      {/* Tablero */}
      <div
        className="relative bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 rounded-2xl shadow-2xl p-4 border-4 border-amber-900"
        style={{
          width: cellSize * BOARD_SIZE + 32,
          height: cellSize * BOARD_SIZE + 32,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.3)',
          backgroundImage: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1) 25%, transparent 25%), linear-gradient(225deg, rgba(217, 119, 6, 0.1) 25%, transparent 25%), linear-gradient(45deg, rgba(217, 119, 6, 0.1) 25%, transparent 25%), linear-gradient(315deg, rgba(217, 119, 6, 0.1) 25%, #b45309 25%)',
          backgroundPosition: '10px 0, 10px 0, 0 0, 0 0',
          backgroundSize: '20px 20px',
          backgroundRepeat: 'repeat',
        }}
      >
        {/* Grid del tablero */}
        <div className="relative" style={{ width: cellSize * BOARD_SIZE, height: cellSize * BOARD_SIZE }}>
          {/* Líneas horizontales */}
          {Array.from({ length: BOARD_SIZE }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute bg-black"
              style={{
                top: i * cellSize + cellSize / 2,
                left: cellSize / 2,
                width: cellSize * (BOARD_SIZE - 1),
                height: 2,
              }}
            />
          ))}

          {/* Líneas verticales */}
          {Array.from({ length: BOARD_SIZE }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute bg-black"
              style={{
                left: i * cellSize + cellSize / 2,
                top: cellSize / 2,
                width: 2,
                height: cellSize * (BOARD_SIZE - 1),
              }}
            />
          ))}

          {/* Puntos de estrella (star points) */}
          {[
            { row: 2, col: 2 },
            { row: 2, col: 6 },
            { row: 4, col: 4 },
            { row: 6, col: 2 },
            { row: 6, col: 6 },
          ].map((point, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-black rounded-full"
              style={{
                top: point.row * cellSize + cellSize / 2 - 3,
                left: point.col * cellSize + cellSize / 2 - 3,
                width: 6,
                height: 6,
              }}
            />
          ))}

          {/* Celdas y piedras */}
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isLastMove =
                gameState.lastMove?.row === rowIndex && gameState.lastMove?.col === colIndex;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="absolute cursor-pointer"
                  style={{
                    top: rowIndex * cellSize + cellSize / 2 - stoneSize / 2,
                    left: colIndex * cellSize + cellSize / 2 - stoneSize / 2,
                    width: stoneSize,
                    height: stoneSize,
                  }}
                  onClick={() => !isAiThinking && onCellClick({ row: rowIndex, col: colIndex })}
                >
                  {/* Área de clic e indicador hover */}
                  <div className="absolute inset-0 -m-2 hover:bg-gradient-to-br hover:from-yellow-400 hover:to-orange-400 hover:bg-opacity-40 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50" />

                  {/* Piedra */}
                  {cell && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`go-stone ${
                        cell === 'black' ? 'go-stone-black' : 'go-stone-white'
                      }`}
                      style={{
                        width: stoneSize,
                        height: stoneSize,
                        position: 'relative',
                        zIndex: 10,
                      }}
                    >
                      {/* Indicador de último movimiento */}
                      {isLastMove && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 15 }}
                          className={`absolute inset-0 m-auto w-3 h-3 rounded-full ${
                            cell === 'black' ? 'bg-white shadow-lg shadow-white/50' : 'bg-black shadow-lg shadow-black/50'
                          } animate-ping-slow`}
                        />
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Indicador de turno de IA */}
      {isAiThinking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-pink-900/70 to-purple-900/70 backdrop-blur-sm rounded-2xl flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-white/95 to-purple-100/95 rounded-2xl p-8 text-center shadow-2xl border-2 border-purple-300"
          >
            <div className="relative mx-auto mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-purple-400 blur-xl"
              />
            </div>
            <p className="text-purple-900 font-bold text-xl mb-2">🤖 IA pensando...</p>
            <p className="text-purple-700 text-sm">Analizando el mejor movimiento</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
