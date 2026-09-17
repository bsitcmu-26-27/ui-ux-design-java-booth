import { useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { motion, type PanInfo } from "framer-motion";
import { LocateFixed, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NoteCard } from "./note-card";
import { useWall } from "./wall-provider";

export function CanvasBoard() {

  const { posts, reactedIds, react, updatePosition } = useWall();
  const approved = posts.filter((post) => post.status === "approved");

  const [view, setView] = useState({ x: -70, y: -40, scale: 0.72 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);

  const zoom = (delta: number) =>
    setView((v) => ({ ...v, scale: Math.min(1.3, Math.max(0.38, v.scale + delta)) }));

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("article,button")) return;
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const x = d.vx + e.clientX - d.x;
    const y = d.vy + e.clientY - d.y;
    setView((v) => ({ ...v, x, y }));
  };

  const wheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 0.08 : -0.08);
  };

  return (
    <TooltipProvider>
      <div
        className="relative h-[calc(100vh-9.5rem)] min-h-[620px] overflow-hidden bg-cork cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={() => { drag.current = null; }}
        onPointerCancel={() => { drag.current = null; }}
        onWheel={wheel}
      >
        <div aria-hidden className="flame-glow absolute -inset-[10%]" />

        <div
          className="absolute left-0 top-0 h-[1450px] w-[1900px] origin-top-left"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
        >
          {approved.map((post) => (
            <motion.div
              key={`${post.id}-${post.x}-${post.y}`}
              className="absolute w-[320px]"
              style={{ left: post.x, top: post.y }}
              drag
              dragMomentum={false}
              onDragEnd={(_, info: PanInfo) => {
                const newX = post.x + info.offset.x / view.scale;
                const newY = post.y + info.offset.y / view.scale;
                updatePosition(post.id, newX, newY);
              }}
            >
              <NoteCard
                post={post}
                reacted={reactedIds.includes(post.id)}
                onReact={react}
              />
            </motion.div>
          ))}
        </div>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-md border border-border bg-background p-1 shadow-xl">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={() => zoom(-0.1)} aria-label="Zoom out">
                <Minus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out</TooltipContent>
          </Tooltip>

          <span className="w-14 text-center text-xs font-semibold">
            {Math.round(view.scale * 100)}%
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={() => zoom(0.1)} aria-label="Zoom in">
                <Plus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in</TooltipContent>
          </Tooltip>

          <div className="mx-1 h-6 w-px bg-border" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setView({ x: -70, y: -40, scale: 0.72 })}
                aria-label="Reset canvas"
              >
                <LocateFixed />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset view</TooltipContent>
          </Tooltip>
        </div>

        <div className="pointer-events-none absolute left-5 top-5 rounded-md bg-foreground/85 px-3 py-2 text-xs text-background shadow">
          Drag to explore · Scroll to zoom
        </div>
      </div>
    </TooltipProvider>
  );
}
