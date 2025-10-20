import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { GameState, getValidMoves, BOARD_SIZE } from '@/lib/goGame';

// Inicializar cliente de Anthropic de forma segura
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY no está configurada');
  }

  return new Anthropic({
    apiKey: apiKey,
  });
};

export async function POST(request: NextRequest) {
  try {
    const gameState: GameState = await request.json();

    // Obtener movimientos válidos
    const validMoves = getValidMoves(gameState);

    if (validMoves.length === 0) {
      return NextResponse.json({ pass: true });
    }

    // Preparar el tablero para el prompt
    const boardString = gameState.board
      .map((row, i) =>
        row
          .map((cell, j) => {
            if (cell === 'black') return 'X';
            if (cell === 'white') return 'O';
            return '.';
          })
          .join(' ')
      )
      .join('\n');

    const prompt = `You are an expert Go player. Analyze this 9x9 Go board and suggest the best move for WHITE.

Current board state (X=black, O=white, .=empty):
${boardString}

Captured stones - Black: ${gameState.capturedBlack}, White: ${gameState.capturedWhite}
Current player: ${gameState.currentPlayer}

Consider:
1. Capturing opponent stones
2. Protecting your groups
3. Expanding territory
4. Strategic positioning

Respond with ONLY the move in format "row,col" (0-indexed, e.g., "4,5"). Choose from these valid moves: ${validMoves.map(m => `(${m.row},${m.col})`).join(', ')}

Your move:`;

    const client = getAnthropicClient();

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extraer la respuesta
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Parsear la respuesta para obtener row,col
    const match = responseText.match(/(\d+),\s*(\d+)/);

    if (match) {
      const row = parseInt(match[1]);
      const col = parseInt(match[2]);

      // Verificar que el movimiento es válido
      const isValid = validMoves.some(m => m.row === row && m.col === col);

      if (isValid) {
        return NextResponse.json({ row, col });
      }
    }

    // Si no se pudo parsear o el movimiento no es válido, elegir uno aleatorio
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    return NextResponse.json(randomMove);

  } catch (error) {
    console.error('Error en AI move:', error);

    // En caso de error, devolver un error apropiado
    return NextResponse.json(
      { error: 'Error al procesar movimiento de IA' },
      { status: 500 }
    );
  }
}
