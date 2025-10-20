'use client';

import { useState, useEffect } from 'react';
import { GameState, Position, createInitialState, makeMove, passMove, isValidMove } from '@/lib/goGame';
import GoBoard from '@/components/GoBoard';
import GameInfo from '@/components/GameInfo';
import WelcomeScreen from '@/components/WelcomeScreen';
import { motion } from 'framer-motion';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Incrementar contador de juegos al iniciar
  const handleStartGame = async () => {
    setShowWelcome(false);
    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'newGame' }),
      });
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  };

  // Manejar movimiento de IA
  const makeAiMove = async (state: GameState) => {
    if (state.currentPlayer !== 'white') return;

    setIsAiThinking(true);

    try {
      const response = await fetch('/api/ai-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });

      const data = await response.json();

      if (data.pass) {
        // IA pasa
        showNotification('IA pasa su turno');
        setGameState(passMove(state));
      } else {
        // IA hace movimiento
        const aiMove: Position = { row: data.row, col: data.col };
        const newState = makeMove(state, aiMove);
        setGameState(newState);
        showNotification(`IA jugó en (${data.row}, ${data.col})`);
      }
    } catch (error) {
      console.error('Error getting AI move:', error);
      showNotification('Error: IA no pudo hacer movimiento');
    } finally {
      setIsAiThinking(false);
    }
  };

  // Efecto para turno de IA
  useEffect(() => {
    if (gameState.currentPlayer === 'white' && gameState.passes < 2 && !showWelcome) {
      // Pequeño delay para que se vea natural
      const timer = setTimeout(() => {
        makeAiMove(gameState);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.passes, showWelcome]);

  // Manejar clic en celda
  const handleCellClick = (pos: Position) => {
    if (gameState.currentPlayer !== 'black') {
      showNotification('¡Es el turno de la IA!');
      return;
    }

    if (gameState.passes >= 2) {
      showNotification('El juego ha terminado. Inicia un nuevo juego.');
      return;
    }

    if (isValidMove(gameState, pos)) {
      const newState = makeMove(gameState, pos);
      setGameState(newState);
    } else {
      showNotification('Movimiento inválido');
    }
  };

  // Pasar turno
  const handlePass = () => {
    if (gameState.currentPlayer !== 'black') return;

    const newState = passMove(gameState);
    setGameState(newState);
    showNotification('Pasaste tu turno');
  };

  // Nuevo juego
  const handleNewGame = async () => {
    setGameState(createInitialState());
    setNotification(null);

    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'newGame' }),
      });
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  };

  // Mostrar notificación temporal
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStartGame} />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            GO Online
          </h1>
          <p className="text-gray-400">
            Desarrollado por{' '}
            <a
              href="https://nex-tech-ia.replit.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Nex-Tech-IA
            </a>
          </p>
        </motion.div>

        {/* Notificaciones */}
        {notification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg shadow-lg">
              {notification}
            </div>
          </motion.div>
        )}

        {/* Contenido principal */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* Tablero */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <GoBoard
              gameState={gameState}
              onCellClick={handleCellClick}
              isAiThinking={isAiThinking}
            />
          </motion.div>

          {/* Panel de información */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <GameInfo
              gameState={gameState}
              onPass={handlePass}
              onNewGame={handleNewGame}
              isAiThinking={isAiThinking}
            />
          </motion.div>
        </div>

        {/* Instrucciones */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 card max-w-3xl mx-auto"
        >
          <h2 className="text-xl font-semibold mb-3">Cómo Jugar</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Objetivo:</strong> Controlar más territorio que tu oponente</li>
            <li>• <strong>Colocar piedras:</strong> Haz clic en una intersección vacía</li>
            <li>• <strong>Capturar:</strong> Rodea completamente las piedras del oponente para capturarlas</li>
            <li>• <strong>Pasar:</strong> Si no tienes movimiento, puedes pasar tu turno</li>
            <li>• <strong>Fin del juego:</strong> Cuando ambos jugadores pasan consecutivamente</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
