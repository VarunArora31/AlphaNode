import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { getBestMove } from "../engine/ai";
import MoveHistory from "./MoveHistory";
import StatsPanel from "./StatsPanel";

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [depth, setDepth] = useState(3);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("");
  const [optionSquares, setOptionSquares] = useState({});

  const updateGame = (fn) => {
    setGame((g) => {
      const copy = new Chess(g.fen());
      fn(copy);
      return copy;
    });
  };

  const getStatus = (g) => {
    if (g.isCheckmate()) return "Checkmate!";
    if (g.isDraw()) return "Draw!";
    if (g.isCheck()) return "Check!";
    return g.turn() === "w" ? "Your turn (White)" : "AI thinking...";
  };

  const makeAIMove = useCallback(
    (currentGame) => {
      if (currentGame.isGameOver()) return;

      setTimeout(() => {
        const result = getBestMove(currentGame, depth);
        if (!result.move) return;

        updateGame((g) => g.move(result.move));
        setStats(result);
        setStatus((prev) => {
          const next = new Chess(currentGame.fen());
          next.move(result.move);
          return getStatus(next);
        });
      }, 150);
    },
    [depth],
  );

  const onDrop = (sourceSquare, targetSquare) => {
    let moveMade = null;

    updateGame((g) => {
      const move = g.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (move) moveMade = move;
    });

    if (!moveMade) return false;

    setOptionSquares({});
    setStatus(getStatus(new Chess())); // will update below

    setGame((g) => {
      setStatus(getStatus(g));
      if (!g.isGameOver()) makeAIMove(g);
      return g;
    });

    return true;
  };

  const onSquareClick = (square) => {
    const moves = game.moves({ square, verbose: true });
    if (!moves.length) return setOptionSquares({});

    const highlights = { [square]: { background: "rgba(255,255,0,0.4)" } };
    moves.forEach((m) => {
      highlights[m.to] = {
        background: game.get(m.to)
          ? "radial-gradient(circle, rgba(255,0,0,0.4) 70%, transparent 70%)"
          : "radial-gradient(circle, rgba(0,200,0,0.4) 30%, transparent 30%)",
        borderRadius: "50%",
      };
    });
    setOptionSquares(highlights);
  };

  const resetGame = () => {
    setGame(new Chess());
    setStats(null);
    setStatus("Your turn (White)");
    setOptionSquares({});
  };

  return (
    <div className="game-container">
      <div className="board-section">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          customSquareStyles={optionSquares}
          boardWidth={500}
          areArrowsAllowed
        />
        <div className="status">{status || "Your turn (White)"}</div>
        <button className="reset-btn" onClick={resetGame}>
          New Game
        </button>
      </div>

      <div className="sidebar">
        <StatsPanel depth={depth} setDepth={setDepth} stats={stats} />
        <MoveHistory moves={game.history()} />
      </div>
    </div>
  );
}
