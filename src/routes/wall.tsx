import { createFileRoute } from "@tanstack/react-router";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WallBrowser } from "@/components/freedom-wall/wall-browser";
import { useWall } from "@/components/freedom-wall/wall-provider";
export const Route = createFileRoute("/wall")({
  head: () => ({
    meta: [
      { title: "The Wall — CMU Freedom Wall" },
      { name: "description", content: "Browse, search, filter, and react to CMU student notes." },
      { property: "og:title", content: "The Wall — CMU Freedom Wall" },
      {
        property: "og:description",
        content: "Read the thoughts, stories, and encouragement shared by CMU students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WallPage,
});
function WallPage() {
  const { setComposerOpen } = useWall();
  return (
    <main>
      <section className="border-b bg-foreground py-12 text-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold">
              The community board
            </p>
            <h1 className="mt-2 font-display text-4xl md:text-6xl">What’s on your mind?</h1>
            <p className="mt-3 max-w-xl text-background/65">
              Read the campus mood, send a little love, or leave something for the next person.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setComposerOpen(true)}
            className="bg-gold text-gold-foreground hover:bg-gold/90"
          >
            <MessageSquarePlus /> Add your note
          </Button>
        </div>
      </section>
      <WallBrowser />
    </main>
  );
}
