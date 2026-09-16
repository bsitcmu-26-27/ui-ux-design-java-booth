import { Heart, ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categoryFor, noteColors, type WallPost } from "@/lib/freedom-wall";

export function NoteCard({ post, reacted = false, onReact, className, large = false }: { post: WallPost; reacted?: boolean; onReact?: (id: string) => void; className?: string; large?: boolean }) {
  const category = categoryFor(post.category) ?? { emoji: "💬", label: "Note" };
  let formattedDate = "";
try {
  formattedDate = post?.createdAt 
    ? new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" }).format(new Date(post.createdAt))
    : "";
} catch {
  formattedDate = "Recently";
}
  const color = noteColors.find((item) => item.id === post.color)?.className ?? "bg-note-yellow";
  const rotation = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "rotate-0"][post.id.length % 5];
  const date = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" }).format(new Date(post.createdAt));
  return (
    <article className={cn("note-card group relative flex min-h-64 flex-col p-5 text-note-ink", color, rotation, large && "min-h-72 p-6", className)}>
      <span className={cn("absolute left-1/2 top-0 h-7 w-20 -translate-x-1/2 -translate-y-2 rotate-1 bg-tape opacity-80", post.id.length % 2 === 0 && "hidden")} aria-hidden="true" />
      <span className={cn("absolute left-1/2 top-2 size-3 -translate-x-1/2 rounded-full bg-pin shadow-sm", post.id.length % 2 !== 0 && "hidden")} aria-hidden="true" />
      <div className="mb-4 flex items-start justify-between gap-3 pt-2 text-xs font-semibold uppercase text-note-muted">
        <span>{category.emoji} {category.label}</span><time dateTime={post.createdAt}>{date}</time>
      </div>
      {post.media && (
        <div className="mb-4 overflow-hidden rounded-sm border border-note-ink/10 bg-note-media">
          {post.media.type === "image" ? <img src={post.media.dataUrl} alt="Attached to this note" className="aspect-video w-full object-cover" /> : <video src={post.media.dataUrl} controls className="aspect-video w-full object-cover" aria-label="Video attached to this note" />}
        </div>
      )}
      <p className={cn("font-hand text-[1.28rem] leading-[1.45]", large && "text-[1.55rem]")}>{post.message}</p>
      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <p className="truncate text-xs font-semibold text-note-muted">— {post.author}</p>
        {onReact ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onReact(post.id)} aria-label={`${reacted ? "Loved" : "Love"} this note, ${post.reactions} reactions`} className={cn("h-8 gap-1.5 px-2 text-note-muted hover:bg-note-ink/10 hover:text-note-ink", reacted && "text-heart")}>
            <Heart className={cn("transition-transform group-active:scale-125", reacted && "fill-current")} /><span>{post.reactions}</span>
          </Button>
        ) : (
          <span className="flex items-center gap-1 text-xs text-note-muted"><Heart className="size-4" />{post.reactions}</span>
        )}
      </div>
      {post.media && <span className="sr-only">{post.media.type === "image" ? <ImageIcon /> : <Video />}</span>}
    </article>
  );
}
