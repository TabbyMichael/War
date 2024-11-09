import { useCallback, useEffect, useRef, useState } from 'react';
import { GameState, Player, Enemy, Assets } from '../types/game';
import { GameRenderer } from '../game/renderer';
import { loadGameAssets } from '../game/sprites';

const PLAYER_SPEED = 5;
const BULLET_SPEED = 10;
const ENEMY_SPEED = 2;

export const useGame = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [assets, setAssets] = useState<Assets | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const [player, setPlayer] = useState<Player>({
    x: 0,
    y: 0,
    health: 100,
    armor: 100,
    score: 0,
    ammo: 30,
    rotation: 0,
    movement: { up: false, down: false, left: false, right: false },
    shooting: false
  });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<any[]>([]);

  // Load game assets
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const loadedAssets = await loadGameAssets();
        setAssets(loadedAssets);
        setGameState('menu');
      } catch (error) {
        console.error('Failed to load game assets:', error);
      }
    };
    loadAssets();
  }, []);

  // Initialize renderer when assets are loaded
  useEffect(() => {
    if (assets && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        rendererRef.current = new GameRenderer(ctx, assets);
      }
    }
  }, [assets, canvasRef]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setPlayer({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      health: 100,
      armor: 100,
      score: 0,
      ammo: 30,
      rotation: 0,
      movement: { up: false, down: false, left: false, right: false },
      shooting: false
    });
    setEnemies([]);
    setBullets([]);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    setPlayer(prev => ({
      ...prev,
      movement: {
        ...prev.movement,
        up: e.key === 'w' || e.key === 'ArrowUp' ? true : prev.movement.up,
        down: e.key === 's' || e.key === 'ArrowDown' ? true : prev.movement.down,
        left: e.key === 'a' || e.key === 'ArrowLeft' ? true : prev.movement.left,
        right: e.key === 'd' || e.key === 'ArrowRight' ? true : prev.movement.right,
      }
    }));
  }, [gameState]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;

    setPlayer(prev => ({
      ...prev,
      movement: {
        ...prev.movement,
        up: e.key === 'w' || e.key === 'ArrowUp' ? false : prev.movement.up,
        down: e.key === 's' || e.key === 'ArrowDown' ? false : prev.movement.down,
        left: e.key === 'a' || e.key === 'ArrowLeft' ? false : prev.movement.left,
        right: e.key === 'd' || e.key === 'ArrowRight' ? false : prev.movement.right,
      }
    }));
  }, [gameState]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPlayer(prev => ({
      ...prev,
      rotation: Math.atan2(y - prev.y, x - prev.x)
    }));
  }, [gameState, canvasRef]);

  const handleMouseDown = useCallback(() => {
    if (gameState !== 'playing') return;
    setPlayer(prev => ({ ...prev, shooting: true }));
  }, [gameState]);

  const handleMouseUp = useCallback(() => {
    if (gameState !== 'playing') return;
    setPlayer(prev => ({ ...prev, shooting: false }));
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing' || !rendererRef.current) return;

    const gameLoop = setInterval(() => {
      const renderer = rendererRef.current;
      if (!renderer) return;

      // Clear and prepare canvas
      renderer.clear();

      // Update player position
      setPlayer(prev => {
        const newX = prev.x + 
          (prev.movement.right ? PLAYER_SPEED : 0) - 
          (prev.movement.left ? PLAYER_SPEED : 0);
        const newY = prev.y + 
          (prev.movement.down ? PLAYER_SPEED : 0) - 
          (prev.movement.up ? PLAYER_SPEED : 0);

        const updatedPlayer = {
          ...prev,
          x: Math.max(0, Math.min(window.innerWidth, newX)),
          y: Math.max(0, Math.min(window.innerHeight, newY))
        };

        // Draw player
        renderer.drawPlayer(updatedPlayer.x, updatedPlayer.y, updatedPlayer.rotation);
        return updatedPlayer;
      });

      // Update and draw bullets
      setBullets(prev => {
        const updatedBullets = prev.map(bullet => {
          const updatedBullet = {
            ...bullet,
            x: bullet.x + Math.cos(bullet.rotation) * BULLET_SPEED,
            y: bullet.y + Math.sin(bullet.rotation) * BULLET_SPEED
          };
          renderer.drawBullet(updatedBullet.x, updatedBullet.y, updatedBullet.rotation);
          return updatedBullet;
        }).filter(bullet => 
          bullet.x >= 0 && 
          bullet.x <= window.innerWidth && 
          bullet.y >= 0 && 
          bullet.y <= window.innerHeight
        );
        return updatedBullets;
      });

      // Update and draw enemies
      setEnemies(prev => {
        const updatedEnemies = prev.map(enemy => {
          const dx = player.x - enemy.x;
          const dy = player.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const vx = (dx / distance) * ENEMY_SPEED;
          const vy = (dy / distance) * ENEMY_SPEED;

          const updatedEnemy = {
            ...enemy,
            x: enemy.x + vx,
            y: enemy.y + vy
          };

          renderer.drawEnemy(updatedEnemy.x, updatedEnemy.y, updatedEnemy.health);
          return updatedEnemy;
        });

        // Spawn new enemies
        if (Math.random() < 0.02) {
          const side = Math.floor(Math.random() * 4);
          let x, y;

          switch (side) {
            case 0: // top
              x = Math.random() * window.innerWidth;
              y = -20;
              break;
            case 1: // right
              x = window.innerWidth + 20;
              y = Math.random() * window.innerHeight;
              break;
            case 2: // bottom
              x = Math.random() * window.innerWidth;
              y = window.innerHeight + 20;
              break;
            default: // left
              x = -20;
              y = Math.random() * window.innerHeight;
          }

          updatedEnemies.push({ x, y, health: 100 });
        }

        return updatedEnemies;
      });

      // Update particles
      renderer.updateParticles();

    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameState, player.movement, canvasRef]);

  return {
    gameState,
    player,
    startGame,
    handleKeyDown,
    handleKeyUp,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp
  };
};