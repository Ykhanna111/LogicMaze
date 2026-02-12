import { motion } from "framer-motion";
import { Flag, Rocket, Wallpaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAZE_GRID, type CellType } from "@/lib/mazeData";

interface MazeGridProps {
  playerX: number;
  playerY: number;
  playerDir: number; // 0, 1, 2, 3
}

export function MazeGrid({ playerX, playerY, playerDir }: MazeGridProps) {
  return (
    <div className="relative p-1 bg-card/50 rounded-xl border border-white/10 shadow-2xl backdrop-blur-sm">
      <div 
        className="grid grid-cols-8 gap-1 sm:gap-2"
        style={{ width: "min(90vw, 500px)", height: "min(90vw, 500px)" }}
      >
        {MAZE_GRID.map((row, y) =>
          row.map((cell, x) => (
            <MazeCell key={`${x}-${y}`} type={cell} x={x} y={y} />
          ))
        )}
      </div>

      {/* Player Overlay - absolute positioned based on grid */}
      <PlayerToken x={playerX} y={playerY} dir={playerDir} />
    </div>
  );
}

function MazeCell({ type, x, y }: { type: CellType; x: number; y: number }) {
  // Checkered pattern for empty floor to give depth
  const isDarker = (x + y) % 2 === 1;

  return (
    <div
      className={cn(
        "relative w-full h-full rounded-md flex items-center justify-center overflow-hidden transition-colors duration-300",
        type === 1 
          ? "bg-slate-700/80 shadow-inner border-t border-white/10" // Wallpaper
          : isDarker ? "bg-white/5" : "bg-white/[0.02]" // Floor
      )}
    >
      {type === 1 && (
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      )}
      
      {type === 2 && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1, 0.8], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
        >
          <Flag size={24} fill="currentColor" />
        </motion.div>
      )}
      
      {/* Coordinate labels for debugging/tech feel (optional, kept subtle) */}
      <span className="absolute bottom-0.5 right-1 text-[8px] text-white/10 font-mono select-none">
        {x},{y}
      </span>
    </div>
  );
}

function PlayerToken({ x, y, dir }: { x: number; y: number; dir: number }) {
  // Calculate percentage position
  // 8 columns = 12.5% per column
  // We add a tiny offset for gap compensation if needed, but flex gap handles it mostly.
  // Using simple percentage based on 100% / 8
  const step = 100 / 8;

  return (
    <motion.div
      className="absolute top-0 left-0 w-[12.5%] h-[12.5%] p-1 sm:p-2 z-10 pointer-events-none"
      animate={{
        x: `${x * 100}%`,
        y: `${y * 100}%`,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <div className="w-full h-full bg-primary rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.6)] flex items-center justify-center relative border border-white/20">
        <motion.div
          animate={{ rotate: dir * 90 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="text-white"
        >
          <Rocket size={20} fill="currentColor" />
        </motion.div>
        
        {/* Thruster effect */}
        <motion.div
          className="absolute -bottom-1 w-2 h-2 bg-cyan-400 rounded-full blur-[2px]"
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          style={{ 
             // Position thruster opposite to direction
             // This is a simplified visual, strictly keeping it at center for now to avoid complex transforms
             display: 'none' 
          }}
        />
      </div>
    </motion.div>
  );
}
