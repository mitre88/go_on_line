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
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 p-1 animate-glow"
            >
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <span className="text-6xl">囲</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4"
            >
              GO Online
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-300 mb-2"
            >
              Juego Milenario, Inteligencia Moderna
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-gray-400"
            >
              Powered by Claude AI
            </motion.p>
          </div>
        </motion.div>

        {/* Características */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { icon: '🎯', title: 'Reglas Auténticas', desc: 'Implementación completa del Go' },
            { icon: '🤖', title: 'IA Avanzada', desc: 'Oponente inteligente con Claude' },
            { icon: '✨', title: 'UI Moderna', desc: 'Diseño atractivo y fluido' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="card text-center hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="button-primary text-xl px-12 py-4 mb-4"
          >
            Comenzar a Jugar
          </motion.button>

          <p className="text-xs text-gray-500">
            Tablero 9x9 | Reglas japonesas simplificadas
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center mt-12"
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
        </motion.div>
      </div>
    </div>
  );
}
