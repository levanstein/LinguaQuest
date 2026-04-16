"use client";

import { SceneId } from "@/lib/types";

const ILLUSTRATIONS: Partial<Record<SceneId, () => React.ReactNode>> = {
  SCENE_1_ARRIVAL: () => (
    <svg viewBox="0 0 400 200" className="w-full h-full">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1205" />
          <stop offset="60%" stopColor="#2d1d0a" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#sky)" />
      {/* Mosque silhouette */}
      <path d="M120,200 L120,120 Q140,80 160,120 L160,200Z" fill="#0F0F0F" opacity="0.8" />
      <circle cx="140" cy="85" r="20" fill="#0F0F0F" opacity="0.8" />
      <rect x="137" y="55" width="6" height="30" fill="#0F0F0F" opacity="0.8" />
      {/* Minaret */}
      <rect x="175" y="70" width="8" height="130" fill="#0F0F0F" opacity="0.8" />
      <circle cx="179" cy="68" r="6" fill="#0F0F0F" opacity="0.8" />
      <rect x="177" y="50" width="4" height="18" fill="#0F0F0F" opacity="0.8" />
      {/* Bosphorus bridge hint */}
      <path d="M0,180 Q100,160 200,170 Q300,160 400,180" stroke="#F59E0B" strokeWidth="1" fill="none" opacity="0.3" />
      {/* Water */}
      <rect x="0" y="180" width="400" height="20" fill="#1a1205" opacity="0.5" />
      {/* Buildings right side */}
      <rect x="250" y="140" width="30" height="60" fill="#0F0F0F" opacity="0.7" />
      <rect x="290" y="130" width="25" height="70" fill="#0F0F0F" opacity="0.7" />
      <rect x="320" y="150" width="35" height="50" fill="#0F0F0F" opacity="0.7" />
      <rect x="360" y="135" width="40" height="65" fill="#0F0F0F" opacity="0.7" />
      {/* Windows (warm glow) */}
      <rect x="258" y="150" width="4" height="4" fill="#F59E0B" opacity="0.5" />
      <rect x="268" y="155" width="4" height="4" fill="#F59E0B" opacity="0.4" />
      <rect x="298" y="145" width="4" height="4" fill="#F59E0B" opacity="0.6" />
      <rect x="330" y="160" width="4" height="4" fill="#F59E0B" opacity="0.3" />
      <rect x="370" y="150" width="4" height="4" fill="#F59E0B" opacity="0.5" />
      <rect x="380" y="145" width="4" height="4" fill="#F59E0B" opacity="0.4" />
      {/* Sun/moon */}
      <circle cx="340" cy="50" r="15" fill="#F59E0B" opacity="0.2" />
    </svg>
  ),

  SCENE_2_TAXI: () => (
    <svg viewBox="0 0 400 180" className="w-full h-full">
      <rect width="400" height="180" fill="#1a1205" opacity="0.3" />
      {/* Road */}
      <rect x="0" y="130" width="400" height="50" fill="#2A2A2A" />
      <line x1="0" y1="155" x2="400" y2="155" stroke="#F59E0B" strokeWidth="2" strokeDasharray="20 15" opacity="0.4" />
      {/* Taxi */}
      <rect x="140" y="105" width="120" height="40" rx="8" fill="#F59E0B" />
      <rect x="155" y="90" width="90" height="25" rx="6" fill="#F59E0B" opacity="0.9" />
      {/* Windows */}
      <rect x="160" y="94" width="35" height="16" rx="3" fill="#87CEEB" opacity="0.4" />
      <rect x="200" y="94" width="35" height="16" rx="3" fill="#87CEEB" opacity="0.4" />
      {/* Wheels */}
      <circle cx="170" cy="148" r="12" fill="#1A1A1A" />
      <circle cx="170" cy="148" r="6" fill="#2A2A2A" />
      <circle cx="230" cy="148" r="12" fill="#1A1A1A" />
      <circle cx="230" cy="148" r="6" fill="#2A2A2A" />
      {/* TAXI sign */}
      <rect x="185" y="82" width="30" height="12" rx="2" fill="#FDE68A" />
      {/* Buildings in background */}
      <rect x="10" y="60" width="40" height="70" fill="#1A1A1A" opacity="0.5" />
      <rect x="60" y="45" width="35" height="85" fill="#1A1A1A" opacity="0.4" />
      <rect x="310" y="50" width="40" height="80" fill="#1A1A1A" opacity="0.5" />
      <rect x="360" y="65" width="35" height="65" fill="#1A1A1A" opacity="0.4" />
    </svg>
  ),

  SCENE_3_MARKET: () => (
    <svg viewBox="0 0 400 180" className="w-full h-full">
      <rect width="400" height="180" fill="#2d1d0a" opacity="0.3" />
      {/* Bazaar arch */}
      <path d="M50,180 L50,60 Q200,10 350,60 L350,180" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.3" />
      {/* Hanging lamps */}
      <line x1="120" y1="40" x2="120" y2="70" stroke="#F59E0B" strokeWidth="1" opacity="0.5" />
      <circle cx="120" cy="75" r="8" fill="#F59E0B" opacity="0.2" />
      <circle cx="120" cy="75" r="3" fill="#F59E0B" opacity="0.6" />
      <line x1="200" y1="25" x2="200" y2="55" stroke="#F59E0B" strokeWidth="1" opacity="0.5" />
      <circle cx="200" cy="60" r="8" fill="#F59E0B" opacity="0.2" />
      <circle cx="200" cy="60" r="3" fill="#F59E0B" opacity="0.6" />
      <line x1="280" y1="40" x2="280" y2="70" stroke="#F59E0B" strokeWidth="1" opacity="0.5" />
      <circle cx="280" cy="75" r="8" fill="#F59E0B" opacity="0.2" />
      <circle cx="280" cy="75" r="3" fill="#F59E0B" opacity="0.6" />
      {/* Market stalls */}
      <rect x="70" y="110" width="80" height="70" fill="#1A1A1A" opacity="0.6" />
      <rect x="70" y="105" width="80" height="8" fill="#F59E0B" opacity="0.3" />
      <rect x="170" y="100" width="70" height="80" fill="#1A1A1A" opacity="0.5" />
      <rect x="170" y="95" width="70" height="8" fill="#F59E0B" opacity="0.25" />
      <rect x="260" y="110" width="80" height="70" fill="#1A1A1A" opacity="0.6" />
      <rect x="260" y="105" width="80" height="8" fill="#F59E0B" opacity="0.3" />
      {/* Carpets hanging */}
      <rect x="85" y="115" width="15" height="40" rx="1" fill="#8B4513" opacity="0.5" />
      <rect x="105" y="118" width="15" height="35" rx="1" fill="#A0522D" opacity="0.4" />
      <rect x="125" y="115" width="15" height="40" rx="1" fill="#CD853F" opacity="0.5" />
      {/* Tea cups */}
      <circle cx="195" cy="130" r="5" fill="#F59E0B" opacity="0.4" />
      <circle cx="210" cy="132" r="5" fill="#F59E0B" opacity="0.3" />
      <circle cx="225" cy="130" r="5" fill="#F59E0B" opacity="0.4" />
    </svg>
  ),

  SCENE_4_HISTORIAN: () => (
    <svg viewBox="0 0 400 180" className="w-full h-full">
      <rect width="400" height="180" fill="#1a1205" opacity="0.2" />
      {/* Mosque dome */}
      <path d="M120,180 L120,100 Q200,30 280,100 L280,180" fill="#1A1A1A" opacity="0.6" />
      <circle cx="200" cy="55" r="5" fill="#F59E0B" opacity="0.4" />
      {/* Minarets */}
      <rect x="100" y="50" width="10" height="130" fill="#1A1A1A" opacity="0.6" />
      <circle cx="105" cy="48" r="5" fill="#1A1A1A" opacity="0.6" />
      <rect x="103" y="35" width="4" height="13" fill="#1A1A1A" opacity="0.6" />
      <rect x="290" y="50" width="10" height="130" fill="#1A1A1A" opacity="0.6" />
      <circle cx="295" cy="48" r="5" fill="#1A1A1A" opacity="0.6" />
      <rect x="293" y="35" width="4" height="13" fill="#1A1A1A" opacity="0.6" />
      {/* Courtyard arches */}
      <path d="M30,180 L30,130 Q55,110 80,130 L80,180" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.2" />
      <path d="M320,180 L320,130 Q345,110 370,130 L370,180" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.2" />
      {/* Fountain */}
      <ellipse cx="200" cy="160" rx="30" ry="10" fill="#F59E0B" opacity="0.1" />
      <rect x="196" y="135" width="8" height="25" fill="#F59E0B" opacity="0.15" />
      {/* Water drops */}
      <circle cx="190" cy="145" r="2" fill="#87CEEB" opacity="0.3" />
      <circle cx="210" cy="148" r="2" fill="#87CEEB" opacity="0.2" />
      {/* Birds */}
      <path d="M50,40 Q55,35 60,40" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
      <path d="M340,30 Q345,25 350,30" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
      <path d="M70,55 Q75,50 80,55" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.2" />
    </svg>
  ),

  SCENE_5_FINALE: () => (
    <svg viewBox="0 0 400 180" className="w-full h-full">
      <defs>
        <linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect width="400" height="180" fill="url(#sunset)" />
      {/* Bookshop */}
      <rect x="130" y="60" width="140" height="120" fill="#1A1A1A" opacity="0.7" />
      <rect x="130" y="55" width="140" height="10" fill="#F59E0B" opacity="0.3" />
      {/* Door */}
      <rect x="180" y="120" width="40" height="60" rx="4" fill="#2d1d0a" />
      <circle cx="213" cy="150" r="3" fill="#F59E0B" opacity="0.6" />
      {/* Windows with warm glow */}
      <rect x="145" y="75" width="30" height="25" rx="2" fill="#F59E0B" opacity="0.4" />
      <rect x="225" y="75" width="30" height="25" rx="2" fill="#F59E0B" opacity="0.4" />
      {/* Books visible in window */}
      <rect x="150" y="85" width="5" height="12" fill="#CD853F" opacity="0.5" />
      <rect x="157" y="83" width="5" height="14" fill="#8B4513" opacity="0.5" />
      <rect x="164" y="85" width="5" height="12" fill="#A0522D" opacity="0.5" />
      <rect x="230" y="85" width="5" height="12" fill="#CD853F" opacity="0.5" />
      <rect x="237" y="83" width="5" height="14" fill="#8B4513" opacity="0.5" />
      <rect x="244" y="85" width="5" height="12" fill="#A0522D" opacity="0.5" />
      {/* Sign */}
      <rect x="160" y="110" width="80" height="14" rx="2" fill="#2A2A2A" />
      {/* Cobblestone street */}
      <ellipse cx="200" cy="178" rx="180" ry="8" fill="#2A2A2A" opacity="0.3" />
      {/* Stars */}
      <circle cx="50" cy="20" r="1.5" fill="#F59E0B" opacity="0.4" />
      <circle cx="350" cy="15" r="1.5" fill="#F59E0B" opacity="0.3" />
      <circle cx="100" cy="35" r="1" fill="#F59E0B" opacity="0.3" />
      <circle cx="300" cy="25" r="1" fill="#F59E0B" opacity="0.4" />
    </svg>
  ),
};

export default function SceneIllustration({ scene }: { scene: SceneId }) {
  const render = ILLUSTRATIONS[scene];
  if (!render) return null;

  return (
    <div className="w-full h-[180px] overflow-hidden rounded-lg mb-4 opacity-80">
      {render()}
    </div>
  );
}
