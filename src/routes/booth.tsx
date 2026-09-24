import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/freedom-wall/note-card";
import { useWall } from "@/components/freedom-wall/wall-provider";
export const Route = createFileRoute("/booth")({
  head: () => ({
    meta: [
      { title: "Booth Mode — CMU Freedom Wall" },
      {
        name: "description",
        content: "A large-screen kiosk view for the CMU Freedom Wall student booth.",
      },
      { property: "og:title", content: "Booth Mode — CMU Freedom Wall" },
      {
        property: "og:description",
        content: "Share a thought at the CMU CISC Freedom Wall booth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BoothPage,
});
function BoothPage() {
  const { posts, setComposerOpen } = useWall();
  const recent = posts.filter((p) => p.status === "approved").slice(0, 6);
  return (
    <main className="min-h-screen bg-cork">
      <div className="flex items-center justify-between bg-primary px-6 py-4 text-primary-foreground">
        <Link to="/" className="flex items-center gap-2 text-sm">
          <ArrowLeft className="size-4" /> Exit booth mode
        </Link>
        <span className="font-display text-xl">CMU Freedom Wall</span>
        <span className="hidden text-xs font-bold uppercase tracking-widest sm:block">
          CISC Booth
        </span>
      </div>
      <section className="mx-auto max-w-[1500px] px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 rounded-md bg-background/95 p-7 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-4xl md:text-6xl">Got something to say?</h1>
            <p className="mt-2 text-lg text-muted-foreground">Pin it here. Anonymous by default.</p>
          </div>
          <Button size="lg" onClick={() => setComposerOpen(true)} className="h-14 px-8 text-base">
            <MessageSquarePlus /> Share Your Thought
          </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {recent.map((post) => (
            <NoteCard key={post.id} post={post} large />
          ))}
        </div>
      </section>
    </main>
  );
}
