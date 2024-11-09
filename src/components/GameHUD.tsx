import React from 'react';
import { Heart, Shield, Target } from 'lucide-react';

interface GameHUDProps {
  player: {
    health: number;
    armor: number;
    score: number;
    ammo: number;
  };
}

export const GameHUD: React.FC<GameHUDProps> = ({ player }) => {
  return (
    <div className="absolute inset-x-0 top-0 p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-500">
            <Heart className="w-6 h-6" />
            <div className="w-32 h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-red-500 rounded-full transition-all"
                style={{ width: `${player.health}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-500">
            <Shield className="w-6 h-6" />
            <div className="w-32 h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${player.armor}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 text-yellow-500">
            <Target className="w-6 h-6" />
            <span className="text-2xl font-bold">{player.score}</span>
          </div>
          <div className="text-white mt-2">
            <span className="font-mono">{player.ammo} / ∞</span>
          </div>
        </div>
      </div>
    </div>
  );
};