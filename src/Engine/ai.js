import {
  pawnEvalWhite,
  pawnEvalBlack,
  knightEval,
  bishopEvalWhite,
  bishopEvalBlack,
  rookEvalWhite,
  rookEvalBlack,
  evalQueen,
  kingEvalWhite,
  kingEvalBlack,
} from "./pieceSquareTables";

let positionCount = 0;

const getPieceValue = (piece, x, y) => {
  if (!piece) return 0;
  const isWhite = piece.color === "w";

  const abs = (() => {
    switch (piece.type) {
      case "p":
        return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
      case "r":
        return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
      case "n":
        return 30 + knightEval[y][x];
      case "b":
        return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
      case "q":
        return 90 + evalQueen[y][x];
      case "k":
        return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
      default:
        throw new Error("Unknown piece: " + piece.type);
    }
  })();

  return isWhite ? abs : -abs;
};

const evaluateBoard = (board) => {
  let total = 0;
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++) total += getPieceValue(board[i][j], j, i);
  return total;
};

const minimax = (depth, game, alpha, beta, isMaximising) => {
  positionCount++;
  if (depth === 0) return -evaluateBoard(game.board());

  const moves = game.moves();

  if (isMaximising) {
    let best = -9999;
    for (const move of moves) {
      game.move(move);
      best = Math.max(best, minimax(depth - 1, game, alpha, beta, false));
      game.undo();
      alpha = Math.max(alpha, best);
      if (beta <= alpha) return best;
    }
    return best;
  } else {
    let best = 9999;
    for (const move of moves) {
      game.move(move);
      best = Math.min(best, minimax(depth - 1, game, alpha, beta, true));
      game.undo();
      beta = Math.min(beta, best);
      if (beta <= alpha) return best;
    }
    return best;
  }
};

const minimaxRoot = (depth, game) => {
  const moves = game.moves();
  let bestVal = -9999;
  let bestMove = null;

  for (const move of moves) {
    game.move(move);
    const val = minimax(depth - 1, game, -10000, 10000, false);
    game.undo();
    if (val >= bestVal) {
      bestVal = val;
      bestMove = move;
    }
  }
  return bestMove;
};

// Returns { move, positionCount, timeMs, positionsPerSec }
export const getBestMove = (game, depth) => {
  positionCount = 0;
  const start = Date.now();
  const move = minimaxRoot(depth, game);
  const timeMs = Date.now() - start;
  return {
    move,
    positionCount,
    timeMs,
    positionsPerSec: Math.round((positionCount * 1000) / timeMs),
  };
};
