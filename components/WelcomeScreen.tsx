'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [stats, setStats] = useState({ totalGames: 0, totalPlayers: 0 });

  useEffect(() => {
    // Cargar estadísticas
    fetch('/api/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(data => {
        // Asegurar que data tiene las propiedades necesarias
        if (data && typeof data.totalGames === 'number' && typeof data.totalPlayers === 'number') {
          setStats(data);
        }
      })
      .catch(err => {
        console.error('Error loading stats:', err);
        // Mantener valores por defecto
      });
  }, []);

  const handleStart = async () => {
    // Incrementar contador de jugadores
    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'newPlayer' }),
      });
    } catch (error) {
      console.error('Error updating stats:', error);
    }

    onStart();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center mb-12"
        >
          <div className="inline-block">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-1 shadow-2xl"
              style={{
                boxShadow: '0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(236, 72, 153, 0.4), 0 0 120px rgba(251, 146, 60, 0.2)',
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-slate-900 to-purple-950 rounded-full flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-pink-600/20"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                <span className="text-7xl relative z-10">囲</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                y: { delay: 0.3 },
                opacity: { delay: 0.3 },
                backgroundPosition: { duration: 5, repeat: Infinity, ease: 'linear' },
              }}
              className="text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-4 drop-shadow-2xl"
              style={{ backgroundSize: '200% auto' }}
            >
              GO Online
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-3"
            >
              ✨ Juego Milenario, Inteligencia Moderna ✨
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-base text-gray-300 flex items-center justify-center gap-2"
            >
              <span>🤖</span>
              Powered by Claude AI
              <span>⚡</span>
            </motion.p>
          </div>
        </motion.div>

        {/* Características */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { icon: '🎯', title: 'Reglas Auténticas', desc: 'Implementación completa del Go', gradient: 'from-purple-500 to-pink-500' },
            { icon: '🤖', title: 'IA Avanzada', desc: 'Oponente inteligente con Claude', gradient: 'from-blue-500 to-cyan-500' },
            { icon: '✨', title: 'UI Moderna', desc: 'Diseño atractivo y fluido', gradient: 'from-pink-500 to-orange-500' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.15, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.08, y: -5 }}
              className="card text-center relative overflow-hidden group cursor-pointer"
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-3"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-300">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Estadísticas */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="card mb-8"
        >
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {(stats?.totalGames ?? 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Partidas Jugadas</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {(stats?.totalPlayers ?? 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Jugadores Totales</div>
            </div>
          </div>
        </motion.div>

        {/* Botón de inicio */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="relative overflow-hidden text-2xl font-black px-16 py-5 mb-4 rounded-2xl shadow-2xl group"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #feca57 100%)',
              backgroundSize: '300% 100%',
            }}
          >
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
              style={{ backgroundSize: '200% 100%' }}
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0"
              style={{
                boxShadow: '0 0 60px rgba(168, 85, 247, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.2)',
              }}
            />
            <span className="relative z-10 flex items-center justify-center gap-3">
              🎮 Comenzar a Jugar 🚀
            </span>
          </motion.button>

          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm text-gray-300 flex items-center justify-center gap-2"
          >
            <span>📐</span>
            Tablero 9x9 | Reglas japonesas simplificadas
            <span>🎯</span>
          </motion.p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center mt-12 space-y-4"
        >
          <p className="text-sm text-gray-400">
            Desarrollado por{' '}
            <a
              href="https://nex-tech-ia.replit.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
            >
              Nex-Tech-IA
            </a>
          </p>

          {/* Botón de donación */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://buy.stripe.com/9B63cvcLObRc8ZJ81bfbq0b', '_blank')}
            className="relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-xl text-white shadow-2xl overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #f06595 25%, #cc5de8 50%, #845ef7 75%, #5c7cfa 100%)',
              backgroundSize: '200% 100%',
            }}
          >
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 opacity-80"
              style={{ backgroundSize: '200% 100%' }}
            />
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.5, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity },
              }}
              className="absolute inset-0 opacity-20"
            >
              <div className="w-full h-full" style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.8) 10%, transparent 11%), radial-gradient(circle, rgba(255,255,255,0.8) 10%, transparent 11%)',
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 15px 15px',
              }} />
            </motion.div>
            <span className="relative z-10 text-3xl">☕</span>
            <span className="relative z-10">Apóyame con un Café</span>
            <span className="relative z-10 text-2xl">💝</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
