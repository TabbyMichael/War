export type GameState = 'loading' | 'menu' | 'playing' | 'gameover';

export interface Player {
  x: number;
  y: number;
  health: number;
  armor: number;
  score: number;
  ammo: number;
  rotation: number;
  movement: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  };
  shooting: boolean;
}

export interface Enemy {
  x: number;
  y: number;
  health: number;
}

export interface Assets {
  background: HTMLImageElement;
  bullet: HTMLImageElement;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}