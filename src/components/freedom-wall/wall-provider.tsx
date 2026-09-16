import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { LAST_POST_KEY, REACTIONS_KEY, STORAGE_KEY, blockedKeywords, seedPosts, type WallPost } from "@/lib/freedom-wall";

type NewPost = Omit<WallPost, "id" | "createdAt" | "reactions" | "status" | "isSeed" | "x" | "y">;
type SubmitResult = { ok: true; status: "approved" | "pending" } | { ok: false; error: string };
type WallContextValue = {
  posts: WallPost[]; reactedIds: string[]; hydrated: boolean;
  addPost: (post: NewPost) => SubmitResult; react: (id: string) => void;
  moderate: (id: string, status: WallPost["status"]) => void; deletePost: (id: string) => void;
  resetDemo: () => void; composerOpen: boolean; setComposerOpen: (open: boolean) => void;
};

const WallContext = createContext<WallContextValue | null>(null);

export function WallProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<WallPost[]>(seedPosts);
  const [reactedIds, setReactedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const reactions = localStorage.getItem(REACTIONS_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as WallPost[] | null;
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
        } else if (Array.isArray(parsed) && parsed.length === 0) {
          localStorage.removeItem(STORAGE_KEY);
          setPosts(seedPosts);
        }
      }

      if (reactions) {
        const parsed = JSON.parse(reactions) as string[] | null;
        if (Array.isArray(parsed)) setReactedIds(parsed);
      }
    } catch {
      toast.error("Saved notes could not be loaded.");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(REACTIONS_KEY, JSON.stringify(reactedIds));
  }, [reactedIds, hydrated]);

  const addPost = useCallback((draft: NewPost): SubmitResult => {
    const message = draft.message.trim();
    if (!message) return { ok: false, error: "Write a thought before posting." };
    if (message.length > 500) return { ok: false, error: "Keep your thought within 500 characters." };
    const normalized = message.toLowerCase().replace(/\s+/g, " ");
    const now = Date.now();
    try {
      const previous = JSON.parse(localStorage.getItem(LAST_POST_KEY) ?? "null") as { text: string; at: number } | null;
      if (previous && previous.text === normalized && now - previous.at < 10 * 60 * 1000) return { ok: false, error: "That looks like a recent duplicate. Try sharing something new." };
      if (previous && now - previous.at < 8000) return { ok: false, error: "Take a breath before posting another note." };
    } catch { /* Invalid prototype metadata can be safely ignored. */ }
    const flagged = blockedKeywords.some((keyword) => normalized.includes(keyword));
    const status: "approved" | "pending" = flagged ? "pending" : "approved";
    const post: WallPost = {
      ...draft, message, author: draft.author.trim() || "Anonymous yarn?", id: crypto.randomUUID(),
      createdAt: new Date().toISOString(), reactions: 0, status,
      isSeed: false, x: 140 + Math.random() * 1250, y: 120 + Math.random() * 850,
    };
    setPosts((current) => [post, ...current]);
    localStorage.setItem(LAST_POST_KEY, JSON.stringify({ text: normalized, at: now }));
    // Production connection point: replace local state with authenticated database writes and server moderation.
    return { ok: true, status };
  }, []);

  const react = useCallback((id: string) => {
    if (reactedIds.includes(id)) { toast("You already sent love to this note."); return; }
    setPosts((current) => current.map((post) => post.id === id ? { ...post, reactions: post.reactions + 1 } : post));
    setReactedIds((current) => [...current, id]);
  }, [reactedIds]);

  const moderate = useCallback((id: string, status: WallPost["status"]) => {
    setPosts((current) => current.map((post) => post.id === id ? { ...post, status } : post));
  }, []);
  const deletePost = useCallback((id: string) => setPosts((current) => current.filter((post) => post.id !== id)), []);
  const resetDemo = useCallback(() => { setPosts(seedPosts); setReactedIds([]); localStorage.removeItem(LAST_POST_KEY); localStorage.removeItem(STORAGE_KEY); toast.success("Demo wall restored."); }, []);

  const value = useMemo(() => ({ posts, reactedIds, hydrated, addPost, react, moderate, deletePost, resetDemo, composerOpen, setComposerOpen }), [posts, reactedIds, hydrated, addPost, react, moderate, deletePost, resetDemo, composerOpen]);
  return <WallContext.Provider value={value}>{children}</WallContext.Provider>;
}

export function useWall() {
  const context = useContext(WallContext);
  if (!context) throw new Error("useWall must be used within WallProvider");
  return context;
}
