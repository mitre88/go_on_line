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

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error API response:', errorData);
        showNotification(`Error: ${errorData.error || 'No se pudo conectar con la IA. Verifica la configuración del servidor.'}`);
        return;
      }

      const data = await response.json();

      if (data.error) {
        showNotification(`Error: ${data.error}`);
        return;
      }

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
      showNotification('Error: No se pudo conectar con la IA. Verifica la configuración del servidor.');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Partículas flotantes decorativas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <motion.h1
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-3"
            style={{ backgroundSize: '200% auto' }}
          >
            GO Online
          </motion.h1>
          <p className="text-gray-300 flex items-center justify-center gap-2">
            <span className="text-lg">🎨</span>
            Desarrollado por{' '}
            <a
              href="https://nex-tech-ia.replit.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-pink-400 transition-colors font-semibold underline decoration-wavy"
            >
              Nex-Tech-IA
            </a>
            <span className="text-lg">✨</span>
          </p>
        </motion.div>

        {/* Notificaciones mejoradas */}
        {notification && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.8 }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.5)',
                  '0 0 40px rgba(236, 72, 153, 0.7)',
                  '0 0 20px rgba(168, 85, 247, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border-2 border-white/20"
              style={{ backgroundSize: '200% 100%' }}
            >
              <motion.div
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                style={{ backgroundSize: '200% 100%' }}
              />
              <p className="relative z-10 font-bold text-lg flex items-center gap-2">
                <span className="text-2xl">💬</span>
                {notification}
              </p>
            </motion.div>
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

        {/* Instrucciones mejoradas */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 card max-w-3xl mx-auto relative overflow-hidden"
        >
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-3xl">📖</span>
              Cómo Jugar
              <span className="text-3xl">🎮</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { emoji: '🎯', title: 'Objetivo', desc: 'Controlar más territorio que tu oponente' },
                { emoji: '🖱️', title: 'Colocar piedras', desc: 'Haz clic en una intersección vacía' },
                { emoji: '⚔️', title: 'Capturar', desc: 'Rodea completamente las piedras del oponente' },
                { emoji: '⏭️', title: 'Pasar', desc: 'Si no tienes movimiento, puedes pasar tu turno' },
                { emoji: '🏁', title: 'Fin del juego', desc: 'Cuando ambos jugadores pasan consecutivamente' },
                { emoji: '🏆', title: 'Victoria', desc: 'El jugador con más puntos (territorio + capturas) gana' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.03, x: 5 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10 hover:border-purple-400/30 transition-all"
                >
                  <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                  <div>
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-300">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
