import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp, ArrowLeft, ArrowRight, Play, RotateCcw, Trash2, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type CommandType = "FORWARD" | "LEFT" | "RIGHT";

interface CommandPanelProps {
  commands: CommandType[];
  onAddCommand: (cmd: CommandType) => void;
  onRun: () => void;
  onReset: () => void;
  onClear: () => void;
  isPlaying: boolean;
  isFull: boolean;
}

export function CommandPanel({
  commands,
  onAddCommand,
  onRun,
  onReset,
  onClear,
  isPlaying,
  isFull,
}: CommandPanelProps) {
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="glass-panel rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Code2 className="text-primary" />
            Command Sequence
          </h2>
          <span className="text-xs font-mono px-2 py-1 rounded border bg-primary/10 text-primary border-primary/20">
            Blocks Used: {commands.length}
          </span>
        </div>

        {/* Command Queue Visualizer */}
        <div className="bg-black/40 rounded-lg p-4 min-h-[200px] border border-white/5 relative overflow-hidden">
          {commands.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-sm font-mono italic">
              // Awaiting inputs...
            </div>
          ) : (
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-2">
                {commands.map((cmd, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 bg-white/5 rounded px-3 py-2 border-l-2 border-primary animate-in fade-in slide-in-from-left-4 duration-200"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <span className="text-muted-foreground font-mono text-xs w-4">
                      {idx + 1}.
                    </span>
                    <CommandIcon cmd={cmd} />
                    <span className="text-sm font-medium tracking-wide text-white/90">
                      MOVE_{cmd}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Button 
            onClick={onRun} 
            disabled={isPlaying || commands.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <Play className="mr-2 h-4 w-4 fill-current" />
            RUN_PROGRAM
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onReset}
              disabled={isPlaying}
              className="flex-1 border-white/10 hover:bg-white/5"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={onClear}
              disabled={isPlaying || commands.length === 0}
              className="flex-1 border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Input Pad */}
      <div className="glass-panel rounded-xl p-6 flex-1">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 font-mono uppercase tracking-wider">
          Available Functions
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          <ControlButton 
            icon={<ArrowLeft />} 
            label="LEFT" 
            onClick={() => onAddCommand("LEFT")}
            disabled={isPlaying || isFull}
          />
          <ControlButton 
            icon={<ArrowUp />} 
            label="FORWARD" 
            onClick={() => onAddCommand("FORWARD")}
            disabled={isPlaying || isFull}
            featured
          />
          <ControlButton 
            icon={<ArrowRight />} 
            label="RIGHT" 
            onClick={() => onAddCommand("RIGHT")}
            disabled={isPlaying || isFull}
          />
        </div>

        <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-lg">
          <p className="text-xs text-primary/80 leading-relaxed font-mono">
            <span className="font-bold">TIP:</span> Guide the rocket to the green flag. Watch out for walls and grid boundaries.
          </p>
        </div>
      </div>
    </div>
  );
}

function ControlButton({ 
  icon, 
  label, 
  onClick, 
  disabled,
  featured = false
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  disabled?: boolean;
  featured?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        featured 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40" 
          : "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-white/5",
      )}
    >
      <div className={cn("p-2 rounded-full", featured ? "bg-white/20" : "bg-black/20")}>
        {icon}
      </div>
      <span className="text-xs font-bold tracking-wider">{label}</span>
    </button>
  );
}

function CommandIcon({ cmd }: { cmd: CommandType }) {
  switch (cmd) {
    case "FORWARD": return <ArrowUp className="w-4 h-4 text-emerald-400" />;
    case "LEFT": return <ArrowLeft className="w-4 h-4 text-blue-400" />;
    case "RIGHT": return <ArrowRight className="w-4 h-4 text-purple-400" />;
  }
}
