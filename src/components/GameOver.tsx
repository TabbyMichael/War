import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
      <div className="text-center p-8 rounded-lg">
        <h2 className="text-4xl font-bold text-white mb-4">Game Over</h2>
        <div className="flex items-center justify-center gap-2 text-yellow-500 mb-8">
          <Trophy className="w-8 h-8" />
          <span className="text-3xl font-bold">{score}</span>
        </div>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    </div>
  );
};