import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const STATS_FILE = path.join(process.cwd(), 'data', 'stats.json');

interface Stats {
  totalGames: number;
  totalPlayers: number;
  lastUpdated: string;
}

// Asegurar que el directorio existe
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Leer estadísticas
async function readStats(): Promise<Stats> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(STATS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Si no existe, crear con valores iniciales
    const initialStats: Stats = {
      totalGames: 0,
      totalPlayers: 0,
      lastUpdated: new Date().toISOString(),
    };
    await writeStats(initialStats);
    return initialStats;
  }
}

// Escribir estadísticas
async function writeStats(stats: Stats) {
  await ensureDataDir();
  await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
}

// GET - Obtener estadísticas
export async function GET() {
  try {
    const stats = await readStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error reading stats:', error);
    return NextResponse.json(
      { error: 'Error al leer estadísticas' },
      { status: 500 }
    );
  }
}

// POST - Incrementar contador
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    const stats = await readStats();

    if (action === 'newGame') {
      stats.totalGames += 1;
    } else if (action === 'newPlayer') {
      stats.totalPlayers += 1;
    }

    stats.lastUpdated = new Date().toISOString();
    await writeStats(stats);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json(
      { error: 'Error al actualizar estadísticas' },
      { status: 500 }
    );
  }
}
