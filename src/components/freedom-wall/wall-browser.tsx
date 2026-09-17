import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, type CategoryId, type WallPost } from "@/lib/freedom-wall";
import { NoteCard } from "./note-card";
import { useWall } from "./wall-provider";

export type Sort = "newest" | "oldest" | "reacted";

export function useFilteredPosts(
  posts: WallPost[] = [],
  search: string,
  category: "all" | CategoryId,
  sort: Sort
) {
  return useMemo(() => {
    if (!Array.isArray(posts)) return [];
    const query = search.trim().toLowerCase();

    return posts
      .filter((post) => post && post.status === "approved")
      .filter((post) => category === "all" || post.category === category)
      .filter((post) => {
        if (!query) return true;
        const haystack = `${post.message ?? ""} ${post.author ?? ""}`.toLowerCase();
        return haystack.includes(query);
      })
      .sort((a, b) => {
        if (sort === "reacted") {
          return (b.reactions ?? 0) - (a.reactions ?? 0);
        }
        const timeA = a.createdAt ? +new Date(a.createdAt) || 0 : 0;
        const timeB = b.createdAt ? +new Date(b.createdAt) || 0 : 0;
        return sort === "oldest" ? timeA - timeB : timeB - timeA;
      });
  }, [posts, search, category, sort]);
}

export function WallBrowser() {
  const { posts = [], reactedIds = [], react } = useWall();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | CategoryId>("all");
  const [sort, setSort] = useState<Sort>("newest");

  const filtered = useFilteredPosts(posts, search, category, sort);
  const clear = () => {
    setSearch("");
    setCategory("all");
  };

  return (
    <>
      <div className="sticky top-16 z-30 border-b border-border bg-background/95 py-4 backdrop-blur">
        <div className="mx-auto max-w-7xl space-y-4 px-5 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search notes</span>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages or names…"
                className="h-11 bg-surface pl-10"
              />
            </label>
            <label className="relative md:w-48">
              <span className="sr-only">Sort notes</span>
              <SlidersHorizontal className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-11 w-full rounded-md border border-input bg-surface pl-10 pr-3 text-sm"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="reacted">Most reacted</option>
              </select>
            </label>
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            <Button
              size="sm"
              variant={category === "all" ? "default" : "outline"}
              onClick={() => setCategory("all")}
            >
              All notes
            </Button>
            {categories.map((item) => (
              <Button
                size="sm"
                variant={category === item.id ? "default" : "outline"}
                key={item.id}
                onClick={() => setCategory(item.id)}
                className="shrink-0"
              >
                {item.emoji} {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        {filtered.length ? (
          <div className="grid items-start gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((post) => (
              <NoteCard
                key={post.id}
                post={post}
                reacted={Array.isArray(reactedIds) && reactedIds.includes(post.id)}
                onReact={react}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md py-24 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent text-3xl">
              🪹
            </span>
            <h2 className="mt-5 font-display text-2xl">No notes found here</h2>
            <p className="mt-2 text-muted-foreground">
              Try another word or open up the category filters.
            </p>
            <Button variant="outline" onClick={clear} className="mt-6">
              <X className="mr-2 size-4" /> Clear filters
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
