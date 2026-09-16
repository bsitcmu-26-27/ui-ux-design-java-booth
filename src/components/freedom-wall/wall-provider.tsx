import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  isCategoryId,
  isNoteColor,
  isPostStatus,
  LAST_POST_KEY,
  REACTIONS_KEY,
  STORAGE_KEY,
  blockedKeywords,
  seedPosts,
  type WallPost,
} from "@/lib/freedom-wall";

type NewPost = Omit<WallPost, "id" | "createdAt" | "reactions" | "status" | "isSeed" | "x" | "y">;
type SubmitResult = { ok: true; status: "approved" | "pending" } | { ok: false; error: string };
type WallContextValue = {
  posts: WallPost[];
  reactedIds: string[];
  hydrated: boolean;
  addPost: (post: NewPost) => SubmitResult;
  react: (id: string) => void;
  moderate: (id: string, status: WallPost["status"]) => void;
  deletePost: (id: string) => void;
  resetDemo: () => void;
  composerOpen: boolean;
  setComposerOpen: (open: boolean) => void;
};

const WallContext = createContext<WallContextValue | null>(null);

function isWallPost(value: unknown): value is WallPost {
  if (!value || typeof value !== "object") return false;
  const post = value as Partial<WallPost>;
  return typeof post.id === "string" && post.id.length > 0
    && typeof post.message === "string" && post.message.length <= 500
    && typeof post.author === "string" && isCategoryId(post.category)
    && isNoteColor(post.color) && typeof post.createdAt === "string"
    && !Number.isNaN(Date.parse(post.createdAt))
    && typeof post.reactions === "number" && Number.isFinite(post.reactions) && post.reactions >= 0
    && isPostStatus(post.status) && typeof post.isSeed === "boolean"
    && typeof post.x === "number" && Number.isFinite(post.x)
    && typeof post.y === "number" && Number.isFinite(post.y)
    && (post.media === undefined || (typeof post.media === "object" && post.media !== null
      && (post.media.type === "image" || post.media.type === "video")
      && typeof post.media.dataUrl === "string" && typeof post.media.name === "string"));
}

function readStoredPosts(): WallPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedPosts;
    const parsed: unknown = JSON.parse(raw);
    const posts = Array.isArray(parsed) ? parsed.filter(isWallPost) : [];
    if (posts.length === 0) localStorage.removeItem(STORAGE_KEY);
    return posts.length > 0 ? posts : seedPosts;
  } catch {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be unavailable. */ }
    return seedPosts;
  }
}

function readStoredReactionIds(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(REACTIONS_KEY) ?? "[]");
    return Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is string => typeof id === "string"))] : [];
  } catch {
    try { localStorage.removeItem(REACTIONS_KEY); } catch { /* Storage may be unavailable. */ }
    return [];
  }
}

function persist(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Private mode or quota exhaustion must not crash the UI. */ }
}

function newId() {
  return typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function WallProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<WallPost[]>(seedPosts);
  const [reactedIds, setReactedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  useEffect(() => {
    try {
      setPosts(readStoredPosts());
      setReactedIds(readStoredReactionIds());
    } catch {
      setPosts(seedPosts);
      setReactedIds([]);
      toast.error("Saved notes could not be loaded. Demo notes restored.");
    } finally { setHydrated(true); }
  }, []);

  useEffect(() => { if (hydrated) persist(STORAGE_KEY, posts); }, [posts, hydrated]);
  useEffect(() => { if (hydrated) persist(REACTIONS_KEY, reactedIds); }, [reactedIds, hydrated]);

  const addPost = useCallback((draft: NewPost): SubmitResult => {
    const message = draft.message.trim();
    if (!message) return { ok: false, error: "Write a thought before posting." };
    if (message.length > 500) return { ok: false, error: "Keep your thought within 500 characters." };
    const normalized = message.toLowerCase().replace(/\s+/g, " ");
    const now = Date.now();
    try {
      const previous = JSON.parse(localStorage.getItem(LAST_POST_KEY) ?? "null") as { text?: unknown; at?: unknown } | null;
      if (typeof previous?.text === "string" && typeof previous.at === "number") {
        if (previous.text === normalized && now - previous.at < 10 * 60 * 1000) return { ok: false, error: "That looks like a recent duplicate. Try sharing something new." };
        if (now - previous.at < 8000) return { ok: false, error: "Take a breath before posting another note." };
      }
    } catch { try { localStorage.removeItem(LAST_POST_KEY); } catch { /* Ignore unavailable storage. */ } }

    const status: "approved" | "pending" = blockedKeywords.some((keyword) => normalized.includes(keyword)) ? "pending" : "approved";
    const post: WallPost = { ...draft, message, author: draft.author.trim() || "Anonymous yarn?", id: newId(), createdAt: new Date().toISOString(), reactions: 0, status, isSeed: false, x: 140 + Math.random() * 1250, y: 120 + Math.random() * 850 };
    setPosts((current) => [post, ...current]);
    persist(LAST_POST_KEY, { text: normalized, at: now });
    return { ok: true, status };
  }, []);

  const react = useCallback((id: string) => {
    if (reactedIds.includes(id)) { toast("You already sent love to this note."); return; }
    setPosts((current) => current.map((post) => post.id === id ? { ...post, reactions: post.reactions + 1 } : post));
    setReactedIds((current) => current.includes(id) ? current : [...current, id]);
  }, [reactedIds]);
  const moderate = useCallback((id: string, status: WallPost["status"]) => setPosts((current) => current.map((post) => post.id === id ? { ...post, status } : post)), []);
  const deletePost = useCallback((id: string) => setPosts((current) => current.filter((post) => post.id !== id)), []);
  const resetDemo = useCallback(() => { setPosts(seedPosts); setReactedIds([]); try { localStorage.removeItem(LAST_POST_KEY); } catch { /* Ignore unavailable storage. */ } persist(STORAGE_KEY, seedPosts); persist(REACTIONS_KEY, []); toast.success("Demo wall restored."); }, []);

  const value = useMemo(() => ({ posts, reactedIds, hydrated, addPost, react, moderate, deletePost, resetDemo, composerOpen, setComposerOpen }), [posts, reactedIds, hydrated, addPost, react, moderate, deletePost, resetDemo, composerOpen]);
  return <WallContext.Provider value={value}>{children}</WallContext.Provider>;
}

export function useWall() {
  const context = useContext(WallContext);
  if (!context) throw new Error("useWall must be used within WallProvider");
  return context;
}
