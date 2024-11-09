import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { GameHUD } from './GameHUD';
import { GameOver } from './GameOver';
import { Keyboard, Gamepad } from 'lucide-react';

export const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    gameState,
    player,
    startGame,
    handleKeyDown,
    handleKeyUp,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
  } = useGame(canvasRef);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-8">Web Battle Royale</h1>
          <div className="space-y-4">
            <button
              onClick={() => startGame()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all transform hover:scale-105"
            >
              Play Now
            </button>
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <Keyboard className="w-6 h-6" />
                  <span>Movement</span>
                </div>
                <p className="text-sm">WASD or Arrow Keys</p>
              </div>
              <div className="text-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <Gamepad className="w-6 h-6" />
                  <span>Combat</span>
                </div>
                <p className="text-sm">Left Click to Shoot</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        width={window.innerWidth}
        height={window.innerHeight}
      />
      {gameState === 'playing' && <GameHUD player={player} />}
      {gameState === 'gameOver' && <GameOver score={player.score} onRestart={startGame} />}
    </div>
  );
};