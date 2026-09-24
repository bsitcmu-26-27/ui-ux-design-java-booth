import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { REACTIONS_KEY, type WallPost } from "@/lib/freedom-wall";

const API_BASE = import.meta.env.API_BASE;
console.log(API_BASE)
type NewPost = Omit<WallPost, "id" | "createdAt" | "reactions" | "status" | "isSeed" | "x" | "y">;
type SubmitResult = { ok: true; status: "approved" | "pending" } | { ok: false; error: string };
type WallContextValue = {
  posts: WallPost[];
  reactedIds: string[];
  hydrated: boolean;
  addPost: (post: NewPost) => Promise<SubmitResult>;
  react: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => voidrwe;
  moderate: (id: string, status: WallPost["status"]) => void;
  deletePost: (id: string) => void;
  resetDemo: () => void;
  composerOpen: boolean;
  setComposerOpen: (open: boolean) => void;
};

function withAbsoluteMedia(post: WallPost): WallPost {
  if (!post.media) return post;
  const url = post.media.dataUrl.startsWith("http")
    ? post.media.dataUrl
    : `${API_BASE}${post.media.dataUrl}`;
  return { ...post, media: { ...post.media, dataUrl: url } };
}

const WallContext = createContext<WallContextValue | null>(null);

function isWallPost(value: unknown): value is WallPost {
  if (!value || typeof value !== "object") return false;
  const post = value as Partial<WallPost>;
  return (
    typeof post.id === "string" &&
    post.id.length > 0 &&
    typeof post.message === "string" &&
    post.message.length <= 500 &&
    typeof post.author === "string" &&
    isCategoryId(post.category) &&
    isNoteColor(post.color) &&
    typeof post.createdAt === "string" &&
    !Number.isNaN(Date.parse(post.createdAt)) &&
    typeof post.reactions === "number" &&
    Number.isFinite(post.reactions) &&
    post.reactions >= 0 &&
    isPostStatus(post.status) &&
    typeof post.isSeed === "boolean" &&
    typeof post.x === "number" &&
    Number.isFinite(post.x) &&
    typeof post.y === "number" &&
    Number.isFinite(post.y) &&
    (post.media === undefined ||
      (typeof post.media === "object" &&
        post.media !== null &&
        (post.media.type === "image" || post.media.type === "video") &&
        typeof post.media.dataUrl === "string" &&
        typeof post.media.name === "string"))
  );
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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Storage may be unavailable. */
    }
    return seedPosts;
  }
}

function readStoredReactionIds(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(REACTIONS_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((id): id is string => typeof id === "string"))]
      : [];
  } catch {
    try {
      localStorage.removeItem(REACTIONS_KEY);
    } catch {
      /* Storage may be unavailable. */
    }
    return [];
  }
}

function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Private mode or quota exhaustion must not crash the UI. */
  }
}

function newId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function WallProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [reactedIds, setReactedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/posts`);
      if (!res.ok) throw new Error("Failed to load posts");
      const raw = (await res.json()) as WallPost[];
      setPosts(raw.map(withAbsoluteMedia));
    } catch {
      toast.error("Could not load the wall. Check your connection.");
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const reactions = localStorage.getItem(REACTIONS_KEY);
        if (reactions) setReactedIds(JSON.parse(reactions) as string[]);
      } catch {
        /* corrupted local reaction cache, safe to ignore */
      }
      await fetchPosts();
      setHydrated(true);
    })();
  }, [fetchPosts]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(REACTIONS_KEY, JSON.stringify(reactedIds));
  }, [reactedIds, hydrated]);

  const addPost = useCallback(async (draft: NewPost, captchToken: string): Promise<SubmitResult> => {
    const message = draft.message.trim();
    if (!message) return { ok: false, error: "Write a thought before posting." };
    if (message.length > 500)
      return { ok: false, error: "Keep your thought within 500 characters." };

    const form = new FormData();
    form.append("message", message);
    form.append("author", draft.author.trim() || "Anonymous yarn?");
    form.append("category", draft.category);
    form.append("color", draft.color);
    form.append("x", String(140 + Math.random() * 1250));
    form.append("y", String(120 + Math.random() * 850));
    form.append("captcha_token", captchaToken);
    if (draft.media) {
      // media.dataUrl is a base64 data: URL from the composer's preview step —
      // fetch() can turn that back into a real Blob to send as multipart
      const blob = await (await fetch(draft.media.dataUrl)).blob();
      form.append("media", blob, draft.media.name);
    }

    try {
      const res = await fetch(`${API_BASE}/posts`, { method: "POST", body: form });
      if (!res.ok) {
        if (res.status === 429) return { ok: false, error: "Take a breath before posting again." };
        if (res.status === 403)
          return { ok: false, error: "That's not the booth passcode. Ask a booth volunteer." };
        const err = await res.json().catch(() => ({ error: "Something went wrong." }));
        return { ok: false, error: err.error ?? "Something went wrong." };
      }
      const created = (await res.json()) as WallPost;
      setPosts((current) => [withAbsoluteMedia(created), ...current]);
      return { ok: true, status: created.status as "approved" | "pending" };
    } catch {
      return { ok: false, error: "Could not reach the server. Try again." };
    }
  }, []);

  const react = useCallback(
    async (id: string) => {
      if (reactedIds.includes(id)) {
        toast("You already sent love to this note.");
        return;
      }
      setPosts((current) =>
        current.map((post) => (post.id === id ? { ...post, reactions: post.reactions + 1 } : post)),
      );
      setReactedIds((current) => [...current, id]);
      try {
        const res = await fetch(`${API_BASE}/posts/${id}/react`, { method: "POST" });
        if (!res.ok) throw new Error();
      } catch {
        toast.error("Reaction didn't save — check your connection.");
      }
    },
    [reactedIds],
  );

  const updatePosition = useCallback(async (id: string, x: number, y: number) => {
    setPosts((current) => current.map((post) => (post.id === id ? { ...post, x, y } : post)));
    try {
      const res = await fetch(`${API_BASE}/posts/${id}/position`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Position didn't save.");
    }
  }, []);

  const moderate = useCallback(
    async (id: string, status: WallPost["status"]) => {
      setPosts((current) => current.map((post) => (post.id === id ? { ...post, status } : post)));
      try {
        const res = await fetch(`${API_BASE}/posts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "X-API-Key": getAdminKey() },
          body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error();
      } catch {
        toast.error("Moderation action didn't save.");
        fetchPosts(); // resync since the optimistic update may be wrong now
      }
    },
    [fetchPosts],
  );

  const deletePost = useCallback(
    async (id: string) => {
      setPosts((current) => current.filter((post) => post.id !== id));
      try {
        const res = await fetch(`${API_BASE}/posts/${id}`, {
          method: "DELETE",
          headers: { "X-API-Key": getAdminKey() },
        });
        if (!res.ok) throw new Error();
      } catch {
        toast.error("Delete didn't save — refreshing.");
        fetchPosts();
      }
    },
    [fetchPosts],
  );

  const resetDemo = useCallback(() => {
    fetchPosts();
    toast.success("Wall refreshed.");
  }, [fetchPosts]);

  const value = useMemo(
    () => ({
      posts,
      reactedIds,
      hydrated,
      addPost,
      react,
      moderate,
      deletePost,
      updatePosition,
      resetDemo,
      composerOpen,
      setComposerOpen,
    }),
    [
      posts,
      reactedIds,
      hydrated,
      addPost,
      react,
      moderate,
      deletePost,
      updatePosition,
      resetDemo,
      composerOpen,
    ],
  );
  return <WallContext.Provider value={value}>{children}</WallContext.Provider>;
}

export function useWall() {
  const context = useContext(WallContext);
  if (!context) throw new Error("useWall must be used within WallProvider");
  return context;
}
