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
        className="relative bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg shadow-2xl p-4"
        style={{
          width: cellSize * BOARD_SIZE + 32,
          height: cellSize * BOARD_SIZE + 32,
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
                  <div className="absolute inset-0 -m-2 hover:bg-yellow-400 hover:bg-opacity-30 rounded-full transition-colors" />

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
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`absolute inset-0 m-auto w-3 h-3 rounded-full ${
                            cell === 'black' ? 'bg-white' : 'bg-black'
                          }`}
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
          className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
        >
          <div className="bg-white bg-opacity-90 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
            <p className="text-purple-900 font-semibold">IA pensando...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
