import React, { useEffect, useRef } from 'react';
import { useGame } from './hooks/useGame';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    gameState,
    player,
    startGame,
    handleKeyDown,
    handleKeyUp,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp
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
  }, [handleKeyDown, handleKeyUp, handleMouseMove, handleMouseDown, handleMouseUp]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: 'none' }}
      />
      
      {gameState !== 'playing' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-8">
              {gameState === 'loading' ? 'Loading...' : 'Battle Royale'}
            </h1>
            {gameState === 'menu' && (
              <button
                onClick={startGame}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Game
              </button>
            )}
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="absolute top-4 left-4 text-white">
          <p className="text-lg">Health: {player.health}</p>
          <p className="text-lg">Armor: {player.armor}</p>
          <p className="text-lg">Score: {player.score}</p>
          <p className="text-lg">Ammo: {player.ammo}</p>
        </div>
      )}
    </div>
  );
}

export default App;