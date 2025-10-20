// Lógica completa del juego de Go
export type Stone = 'black' | 'white' | null;
export type Board = Stone[][];

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  board: Board;
  currentPlayer: 'black' | 'white';
  capturedBlack: number;
  capturedWhite: number;
  moveHistory: Position[];
  lastMove: Position | null;
  passes: number;
}

export const BOARD_SIZE = 9; // 9x9 para juego más rápido

export const createEmptyBoard = (): Board => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
};

export const createInitialState = (): GameState => ({
  board: createEmptyBoard(),
  currentPlayer: 'black',
  capturedBlack: 0,
  capturedWhite: 0,
  moveHistory: [],
  lastMove: null,
  passes: 0,
});

// Obtener vecinos adyacentes de una posición
const getNeighbors = (pos: Position): Position[] => {
  const neighbors: Position[] = [];
  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  for (const dir of directions) {
    const newRow = pos.row + dir.row;
    const newCol = pos.col + dir.col;
    if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }

  return neighbors;
};

// Encontrar grupo de piedras conectadas
const findGroup = (board: Board, pos: Position): Position[] => {
  const stone = board[pos.row][pos.col];
  if (!stone) return [];

  const group: Position[] = [];
  const visited = new Set<string>();
  const queue: Position[] = [pos];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.row},${current.col}`;

    if (visited.has(key)) continue;
    visited.add(key);

    if (board[current.row][current.col] === stone) {
      group.push(current);
      queue.push(...getNeighbors(current));
    }
  }

  return group;
};

// Verificar si un grupo tiene libertades (espacios vacíos adyacentes)
const hasLiberties = (board: Board, group: Position[]): boolean => {
  for (const pos of group) {
    const neighbors = getNeighbors(pos);
    for (const neighbor of neighbors) {
      if (board[neighbor.row][neighbor.col] === null) {
        return true;
      }
    }
  }
  return false;
};

// Capturar grupos sin libertades
const captureGroups = (board: Board, opponent: Stone): Position[] => {
  const captured: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === opponent) {
        const group = findGroup(board, { row, col });
        if (group.length > 0 && !hasLiberties(board, group)) {
          // Marcar para captura
          const alreadyCaptured = captured.some(c =>
            group.some(g => g.row === c.row && g.col === c.col)
          );
          if (!alreadyCaptured) {
            captured.push(...group);
          }
        }
      }
    }
  }

  return captured;
};

// Verificar si un movimiento es válido
export const isValidMove = (state: GameState, pos: Position): boolean => {
  // Verificar límites
  if (pos.row < 0 || pos.row >= BOARD_SIZE || pos.col < 0 || pos.col >= BOARD_SIZE) {
    return false;
  }

  // Verificar si la posición está vacía
  if (state.board[pos.row][pos.col] !== null) {
    return false;
  }

  // Crear una copia del tablero para simular el movimiento
  const testBoard = state.board.map(row => [...row]);
  testBoard[pos.row][pos.col] = state.currentPlayer;

  const opponent = state.currentPlayer === 'black' ? 'white' : 'black';

  // Capturar grupos enemigos
  const capturedEnemies = captureGroups(testBoard, opponent);
  capturedEnemies.forEach(c => {
    testBoard[c.row][c.col] = null;
  });

  // Verificar regla de suicidio: el grupo colocado debe tener libertades
  const placedGroup = findGroup(testBoard, pos);
  if (!hasLiberties(testBoard, placedGroup)) {
    return false;
  }

  // Verificar regla de Ko (no repetir posición inmediata anterior)
  // Esta es una implementación simplificada
  if (state.moveHistory.length > 0) {
    const lastMove = state.moveHistory[state.moveHistory.length - 1];
    if (capturedEnemies.length === 1 &&
        capturedEnemies[0].row === lastMove.row &&
        capturedEnemies[0].col === lastMove.col) {
      return false;
    }
  }

  return true;
};

// Realizar un movimiento
export const makeMove = (state: GameState, pos: Position): GameState => {
  if (!isValidMove(state, pos)) {
    return state;
  }

  const newBoard = state.board.map(row => [...row]);
  newBoard[pos.row][pos.col] = state.currentPlayer;

  const opponent = state.currentPlayer === 'black' ? 'white' : 'black';
  const captured = captureGroups(newBoard, opponent);

  // Remover piedras capturadas
  captured.forEach(c => {
    newBoard[c.row][c.col] = null;
  });

  const newCapturedCount = captured.length;

  return {
    board: newBoard,
    currentPlayer: opponent,
    capturedBlack: state.currentPlayer === 'white' ? state.capturedBlack + newCapturedCount : state.capturedBlack,
    capturedWhite: state.currentPlayer === 'black' ? state.capturedWhite + newCapturedCount : state.capturedWhite,
    moveHistory: [...state.moveHistory, pos],
    lastMove: pos,
    passes: 0,
  };
};

// Pasar turno
export const passMove = (state: GameState): GameState => {
  return {
    ...state,
    currentPlayer: state.currentPlayer === 'black' ? 'white' : 'black',
    passes: state.passes + 1,
  };
};

// Calcular territorio (método simplificado)
export const calculateScore = (board: Board): { black: number; white: number } => {
  let blackScore = 0;
  let whiteScore = 0;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 'black') {
        blackScore++;
      } else if (board[row][col] === 'white') {
        whiteScore++;
      } else {
        // Territorio vacío - atribuir al jugador más cercano
        const neighbors = getNeighbors({ row, col });
        let blackNeighbors = 0;
        let whiteNeighbors = 0;

        neighbors.forEach(n => {
          if (board[n.row][n.col] === 'black') blackNeighbors++;
          if (board[n.row][n.col] === 'white') whiteNeighbors++;
        });

        if (blackNeighbors > whiteNeighbors) {
          blackScore += 0.5;
        } else if (whiteNeighbors > blackNeighbors) {
          whiteScore += 0.5;
        }
      }
    }
  }

  return { black: blackScore, white: whiteScore };
};

// Obtener movimientos válidos para la IA
export const getValidMoves = (state: GameState): Position[] => {
  const validMoves: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const pos = { row, col };
      if (isValidMove(state, pos)) {
        validMoves.push(pos);
      }
    }
  }

  return validMoves;
};
