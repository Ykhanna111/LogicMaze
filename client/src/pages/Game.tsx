import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

import { MazeGrid } from "@/components/MazeGrid";
import { CommandPanel, type CommandType } from "@/components/CommandPanel";
import { MAZE_GRID, DIRECTIONS } from "@/lib/mazeData";
import { useSubmitGameResult } from "@/hooks/use-game";
import { useToast } from "@/hooks/use-toast";

// Starting State
const START_POS = { x: 0, y: 0, dir: 1 }; // 0,0 facing Right
const MAX_COMMANDS = 6;

export default function GamePage() {
  const [player, setPlayer] = useState(START_POS);
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "RUNNING" | "WON" | "LOST">("IDLE");

  const submitResult = useSubmitGameResult();
  const { toast } = useToast();

  const handleAddCommand = (cmd: CommandType) => {
    if (commands.length < MAX_COMMANDS) {
      setCommands([...commands, cmd]);
    }
  };

  const handleReset = () => {
    setPlayer(START_POS);
    setStatus("IDLE");
    setIsPlaying(false);
  };

  const handleClear = () => {
    setCommands([]);
    handleReset();
  };

  const runGame = async () => {
    if (commands.length === 0) return;
    
    setIsPlaying(true);
    setStatus("RUNNING");
    
    // Reset player to start before running
    let currentX = START_POS.x;
    let currentY = START_POS.y;
    let currentDir = START_POS.dir;
    
    setPlayer({ x: currentX, y: currentY, dir: currentDir });
    
    // Initial delay for visual readiness
    await new Promise(r => setTimeout(r, 500));

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];

      // Logic Step
      if (cmd === "LEFT") {
        currentDir = (currentDir + 3) % 4; // -1 but handled with mod math
      } else if (cmd === "RIGHT") {
        currentDir = (currentDir + 1) % 4;
      } else if (cmd === "FORWARD") {
        const move = DIRECTIONS[currentDir];
        const nextX = currentX + move.dx;
        const nextY = currentY + move.dy;

        // Check Bounds
        if (nextX < 0 || nextX >= 8 || nextY < 0 || nextY >= 8) {
          handleGameOver("CRASH! You hit the edge of the universe.");
          return;
        }

        // Check Wall
        if (MAZE_GRID[nextY][nextX] === 1) {
          handleGameOver("CRASH! You hit a wall.");
          return;
        }

        currentX = nextX;
        currentY = nextY;
      }

      // Update State for animation
      setPlayer({ x: currentX, y: currentY, dir: currentDir });
      
      // Wait for animation
      await new Promise(r => setTimeout(r, 600));

      // Check Win
      if (MAZE_GRID[currentY][currentX] === 2) {
        handleWin();
        return;
      }
    }

    // If loop finishes and no win/loss
    if (status !== "WON" && status !== "LOST") {
      setIsPlaying(false);
      setStatus("IDLE");
      
      // Check if they used too many blocks or just stopped short
      if (commands.length > 0) {
        toast({
          title: "Program Ended",
          description: "Execution complete, but the goal was not reached.",
        });
      }
    }
  };

  const handleGameOver = (message: string) => {
    setIsPlaying(false);
    setStatus("LOST");
    toast({
      title: "Mission Failed",
      description: message,
      variant: "destructive",
    });
    submitResult.mutate({
      isWin: false,
      movesCount: commands.length
    });
  };

  const handleWin = () => {
    setIsPlaying(false);
    setStatus("WON");
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#34D399', '#A78BFA', '#F472B6']
    });
    submitResult.mutate({
      isWin: true,
      movesCount: commands.length
    });
  };

  return (
    <div className="min-h-screen grid-bg bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg border border-primary/20">
              <Terminal className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-white">
                LOGIC<span className="text-primary">MAZE</span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                v1.0.4 // SYSTEM_READY
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
            <StatusBadge status={status} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-full items-start justify-center">
          
          {/* Left Column: The Maze */}
          <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[400px]">
            <div className="relative group">
              {/* Decorative glow behind maze */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000" />
              
              <MazeGrid 
                playerX={player.x} 
                playerY={player.y} 
                playerDir={player.dir} 
              />
              
              <AnimatePresence>
                {status === "WON" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-20 backdrop-blur-[2px]"
                  >
                    <div className="bg-emerald-500/90 text-white px-8 py-4 rounded-2xl shadow-2xl font-display font-bold text-2xl border border-emerald-400/50 animate-bounce">
                      LEVEL COMPLETE!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 text-center sm:hidden">
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="w-full lg:w-[400px] xl:w-[450px]">
            <CommandPanel 
              commands={commands}
              onAddCommand={handleAddCommand}
              onRun={runGame}
              onReset={handleReset}
              onClear={handleClear}
              isPlaying={isPlaying}
              isFull={commands.length >= MAX_COMMANDS}
            />
          </div>

        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: "IDLE" | "RUNNING" | "WON" | "LOST" }) {
  const styles = {
    IDLE: "bg-slate-800 text-slate-400 border-slate-700",
    RUNNING: "bg-blue-900/50 text-blue-400 border-blue-800 animate-pulse",
    WON: "bg-emerald-900/50 text-emerald-400 border-emerald-800",
    LOST: "bg-red-900/50 text-red-400 border-red-800",
  };

  return (
    <div className={cn("px-3 py-1 rounded-full border text-xs font-mono font-bold tracking-widest uppercase", styles[status])}>
      STATUS: {status}
    </div>
  );
}
