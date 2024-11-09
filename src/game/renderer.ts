import { Assets, Particle } from '../types/game';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private particles: Particle[] = [];

  constructor(ctx: CanvasRenderingContext2D, assets: Assets) {
    this.ctx = ctx;
    this.assets = assets;
    this.setupCanvas();
  }

  private setupCanvas() {
    const canvas = this.ctx.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  clear() {
    const { width, height } = this.ctx.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.drawBackground();
  }

  private drawBackground() {
    const { width, height } = this.ctx.canvas;
    const pattern = this.ctx.createPattern(this.assets.background, 'repeat');
    if (pattern) {
      this.ctx.fillStyle = pattern;
      this.ctx.fillRect(0, 0, width, height);
    }
  }

  drawPlayer(x: number, y: number, rotation: number) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    
    // Draw player body
    this.ctx.beginPath();
    this.ctx.fillStyle = '#4a90e2';
    this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw player direction indicator
    this.ctx.beginPath();
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.moveTo(20, 0);
    this.ctx.lineTo(-5, 10);
    this.ctx.lineTo(-5, -10);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.restore();
  }

  drawBullet(x: number, y: number, rotation: number) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.drawImage(this.assets.bullet, -4, -4, 8, 8);
    this.ctx.restore();
  }

  drawEnemy(x: number, y: number, health: number) {
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Draw enemy body
    this.ctx.beginPath();
    this.ctx.fillStyle = '#e74c3c';
    this.ctx.arc(0, 0, 15, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw health bar
    const healthBarWidth = 30;
    const healthBarHeight = 4;
    const healthPercentage = health / 100;
    
    this.ctx.fillStyle = '#c0392b';
    this.ctx.fillRect(-healthBarWidth/2, -25, healthBarWidth, healthBarHeight);
    this.ctx.fillStyle = '#27ae60';
    this.ctx.fillRect(
      -healthBarWidth/2,
      -25,
      healthBarWidth * healthPercentage,
      healthBarHeight
    );
    
    this.ctx.restore();
  }

  addParticle(x: number, y: number, color: string) {
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color
      });
    }
  }

  updateParticles() {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.02;
      
      if (particle.life > 0) {
        this.ctx.globalAlpha = particle.life;
        this.ctx.beginPath();
        this.ctx.fillStyle = particle.color;
        this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        return true;
      }
      return false;
    });
  }
}