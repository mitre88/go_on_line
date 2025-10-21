import { NextRequest, NextResponse } from 'next/server';

interface Stats {
  totalGames: number;
  totalPlayers: number;
  lastUpdated: string;
}

// Usar variables en memoria (se resetean cuando la función serverless se recicla)
// En producción, considera usar una base de datos como Vercel KV, Redis, o PostgreSQL
let memoryStats: Stats = {
  totalGames: 0,
  totalPlayers: 0,
  lastUpdated: new Date().toISOString(),
};

// GET - Obtener estadísticas
export async function GET() {
  try {
    return NextResponse.json(memoryStats);
  } catch (error) {
    console.error('Error reading stats:', error);
    // Devolver valores por defecto en caso de error
    return NextResponse.json({
      totalGames: 0,
      totalPlayers: 0,
      lastUpdated: new Date().toISOString(),
    });
  }
}

// POST - Incrementar contador
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'newGame') {
      memoryStats.totalGames += 1;
    } else if (action === 'newPlayer') {
      memoryStats.totalPlayers += 1;
    }

    memoryStats.lastUpdated = new Date().toISOString();

    return NextResponse.json(memoryStats);
  } catch (error) {
    console.error('Error updating stats:', error);
    // Devolver valores actuales en caso de error
    return NextResponse.json(memoryStats);
  }
}
